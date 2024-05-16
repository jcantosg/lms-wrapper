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

export class CreateEnrollmentHandler implements CommandHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly subjectGetter: SubjectGetter,
    private readonly transactionalService: TransactionalService,
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
        SubjectCallFinalGradeEnum.NP,
        SubjectCallStatusEnum.NOT_STARTED,
        command.user,
      );
      enrollment.addSubjectCall(subjectCall);
      await this.transactionalService.execute({
        subjectCall: subjectCall,
        enrollment: enrollment,
      });
    }
  }
}
