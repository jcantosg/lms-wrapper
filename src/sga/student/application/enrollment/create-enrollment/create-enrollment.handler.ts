import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { CreateEnrollmentCommand } from '#student/application/enrollment/create-enrollment/create-enrollment.command';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { v4 as uuid } from 'uuid';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { InternalGroupMemberAddedEvent } from '#student/domain/event/internal-group/internal-group-member-added.event';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class CreateEnrollmentHandler implements CommandHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly subjectGetter: SubjectGetter,
    private readonly transactionalService: TransactionalService,
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: CreateEnrollmentCommand): Promise<void> {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      command.academicRecordId,
      command.user,
    );

    for (const enrollmentSubject of command.enrollmentSubjects) {
      const subject = await this.subjectGetter.getByAdminUser(
        enrollmentSubject.subjectId,
        command.user.businessUnits.map(
          (businessUnit: BusinessUnit) => businessUnit.id,
        ),
        command.user.roles.includes(AdminUserRoles.SUPERADMIN),
      );
      const programBlock = academicRecord.academicProgram.programBlocks.find(
        (programBlock: ProgramBlock): Subject | undefined => {
          return programBlock.subjects.find(
            (sb: Subject) => subject.id === sb.id,
          );
        },
      );
      if (!programBlock) {
        throw new ProgramBlockNotFoundException();
      }
      const enrollment = Enrollment.createUniversae(
        enrollmentSubject.enrollmentId,
        subject,
        academicRecord,
        programBlock,
        command.user,
      );
      const subjectCall = SubjectCall.create(
        uuid(),
        enrollment,
        1,
        new Date(),
        SubjectCallFinalGradeEnum.ONGOING,
        SubjectCallStatusEnum.ONGOING,
        command.user,
      );
      enrollment.addSubjectCall(subjectCall);

      const internalGroup =
        subject.type !== SubjectType.SPECIALTY
          ? await this.getInternalGroup(enrollment.subject, academicRecord)
          : null;

      if (internalGroup) {
        internalGroup.updatedBy = command.user;
        internalGroup.updatedAt = new Date();

        await this.eventDispatcher.dispatch(
          new InternalGroupMemberAddedEvent(internalGroup),
        );
      }

      await this.transactionalService.execute({
        subjectCall: subjectCall,
        enrollment: enrollment,
        internalGroup,
        student: academicRecord.student,
      });
    }
  }

  private async getInternalGroup(
    subject: Subject,
    academicRecord: AcademicRecord,
  ): Promise<InternalGroup | null> {
    const internalGroups = await this.internalGroupRepository.getByKeys(
      academicRecord.academicPeriod,
      academicRecord.academicProgram,
      subject,
    );
    const defaultGroup = internalGroups.find((group) => group.isDefault);
    if (!defaultGroup) {
      throw new InternalGroupNotFoundException();
    }

    return defaultGroup;
  }
}
