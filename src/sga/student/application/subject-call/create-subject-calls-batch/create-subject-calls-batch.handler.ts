import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import {
  isSubjectCallTaken,
  SubjectCallStatusEnum,
} from '#student/domain/enum/enrollment/subject-call-status.enum';
import {
  Enrollment,
  FIRST_CALL_NUMBER,
} from '#student/domain/entity/enrollment.entity';
import { CreateSubjectCallsBatchCommand } from '#student/application/subject-call/create-subject-calls-batch/create-subject-calls-batch.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { InvalidAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-period.invalid.exception';
import { InvalidAcademicProgramException } from '#shared/domain/exception/academic-offering/academic-program.invalid.exception';
import { SubjectCallsCreatedEvent } from '#student/domain/event/subject-call/subject-calls-created.event';

export class CreateSubjectCallsBatchHandler implements CommandHandler {
  constructor(
    private readonly subjectCallRepository: SubjectCallRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly enrollmentGetter: EnrollmentGetter,
    private uuidService: UUIDGeneratorService,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: CreateSubjectCallsBatchCommand): Promise<void> {
    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      command.adminUser.businessUnits.map((bu) => bu.id),
    );

    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      command.academicPeriodId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (businessUnit.id !== academicPeriod.businessUnit.id) {
      throw new InvalidAcademicPeriodException();
    }

    const academicPrograms: AcademicProgram[] = [];
    const subjectCalls: SubjectCall[] = [];

    for (const id of command.academicProgramIds) {
      const academicProgram = await this.academicProgramGetter.getByAdminUser(
        id,
        command.adminUser.businessUnits.map((bu) => bu.id),
        command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );

      if (
        !academicProgram.academicPeriods
          .map((ap) => ap.id)
          .includes(academicPeriod.id)
      ) {
        throw new InvalidAcademicProgramException();
      }
      academicPrograms.push(academicProgram);

      const subjects: Subject[] = [];
      academicProgram.programBlocks.forEach((pb) => {
        subjects.push(...pb.subjects);
      });

      const enrollments: Enrollment[] =
        await this.enrollmentGetter.getByMultipleSubjects(
          subjects,
          command.adminUser,
        );

      enrollments.forEach((enrollment) => {
        const newSubjectCall = this.getSubjectCall(
          enrollment,
          command.adminUser,
        );
        if (newSubjectCall) {
          subjectCalls.push(newSubjectCall);
        }
      });
    }

    const uniqueSubjectCalls = subjectCalls.reduce(
      (accumulator: SubjectCall[], current: SubjectCall) => {
        if (
          !accumulator.find((sc) => sc.enrollment.id === current.enrollment.id)
        ) {
          accumulator.push(current);
        }

        return accumulator;
      },
      [],
    );

    this.subjectCallRepository.saveBatch(uniqueSubjectCalls);

    await this.eventDispatcher.dispatch(
      new SubjectCallsCreatedEvent(
        businessUnit,
        academicPeriod,
        academicPrograms,
        command.adminUser,
      ),
    );
  }

  private getSubjectCall(
    enrollment: Enrollment,
    adminUser: AdminUser,
  ): SubjectCall | null {
    if (enrollment.visibility === EnrollmentVisibilityEnum.NO) {
      return null;
    }
    const subjectLastCall = enrollment.getLastCall();
    const nextNumberCall = this.calculateNextNumberCall(
      subjectLastCall,
      enrollment,
    );

    if (nextNumberCall !== null) {
      const subjectCall = SubjectCall.create(
        this.uuidService.generate(),
        enrollment,
        nextNumberCall,
        new Date(),
        SubjectCallFinalGradeEnum.ONGOING,
        SubjectCallStatusEnum.ONGOING,
        adminUser,
      );

      return subjectCall;
    }

    return null;
  }

  private calculateNextNumberCall(
    lastCall: SubjectCall | null,
    enrollment: Enrollment,
  ): number | null {
    if (!lastCall) {
      return FIRST_CALL_NUMBER;
    }

    if (!isSubjectCallTaken(lastCall)) {
      return null;
    }

    if (lastCall.callNumber >= enrollment.maxCalls) {
      return null;
    }

    if (
      [SubjectCallStatusEnum.PASSED, SubjectCallStatusEnum.ONGOING].includes(
        lastCall.status,
      )
    ) {
      return null;
    }

    if (lastCall.status === SubjectCallStatusEnum.RENOUNCED) {
      return lastCall.callNumber;
    }

    return lastCall.callNumber + 1;
  }
}
