import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { Student } from '#shared/domain/entity/student.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { PromoteStudentCommand } from '#student/application/administrative-group/promote-student/promote-student.command';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class PromoteStudentHandler implements CommandHandler {
  constructor(
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly studentGetter: StudentGetter,
  ) {}

  async handle(command: PromoteStudentCommand): Promise<void> {
    const academicRecord = await this.academicRecordRepository.get(
      command.academicRecordId,
    );

    if (
      academicRecord &&
      academicRecord.status === AcademicRecordStatusEnum.VALID
    ) {
      const enrollments =
        await this.enrollmentRepository.getByAcademicRecordAndBlock(
          academicRecord,
          command.programBlock,
        );

      const enrollmentPassed: Enrollment[] = [];
      for (const enrollment of enrollments) {
        if (
          enrollment.calls.find(
            (call) => call.status === SubjectCallStatusEnum.PASSED,
          )
        ) {
          enrollmentPassed.push(enrollment);
        }
      }
      if (enrollmentPassed.length === enrollments.length) {
        const student = await this.studentGetter.get(command.studentId);
        await this.promoteStudent(
          student,
          academicRecord,
          command.programBlock,
          command.adminUser,
        );
      }
    }
  }

  async promoteStudent(
    student: Student,
    academicRecord: AcademicRecord,
    programBlock: ProgramBlock,
    adminUser: AdminUser,
  ): Promise<void> {
    const groups =
      await this.administrativeGroupRepository.getByStudentAndAcademicPeriodAndAcademicProgram(
        student.id,
        academicRecord.academicPeriod.id,
        academicRecord.academicProgram.id,
      );
    const group = groups.find(
      (group) => group.programBlock.id === programBlock.id,
    );
    if (!group) {
      throw new AdministrativeGroupNotFoundException();
    }

    const nextGroup =
      await this.administrativeGroupRepository.getByAcademicPeriodAndProgramAndBlock(
        group.academicPeriod.id,
        group.academicProgram.id,
        group.academicPeriod.getNextBlock(group.periodBlock).name,
      );

    if (!nextGroup) {
      await this.finishAcademicRecord(academicRecord, adminUser);

      return;
    }

    await this.administrativeGroupRepository.moveStudents(
      [student],
      group,
      nextGroup,
    );
  }

  async finishAcademicRecord(
    academicRecord: AcademicRecord,
    adminUser: AdminUser,
  ): Promise<void> {
    const enrollments =
      await this.enrollmentRepository.getByAcademicRecord(academicRecord);

    const enrollmentPassed: Enrollment[] = [];
    for (const enrollment of enrollments) {
      if (
        enrollment.calls.find(
          (call) => call.status === SubjectCallStatusEnum.PASSED,
        )
      ) {
        enrollmentPassed.push(enrollment);
      }
    }
    if (enrollmentPassed.length === enrollments.length) {
      academicRecord.updateStatus(AcademicRecordStatusEnum.FINISHED, adminUser);
      await this.academicRecordRepository.save(academicRecord);
    }
  }
}
