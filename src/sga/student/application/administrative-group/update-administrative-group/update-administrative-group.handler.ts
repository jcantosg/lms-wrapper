import { CommandHandler } from '#shared/domain/bus/command.handler';
import { UpdateAdministrativeGroupCommand } from '#student/application/administrative-group/update-administrative-group/update-administrative-group.command';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { Student } from '#shared/domain/entity/student.entity';
import { Logger } from '@nestjs/common';
import { Enrollment } from '#student/domain/entity/enrollment.entity';

export class UpdateAdministrativeGroupHandler implements CommandHandler {
  private logger: Logger;
  constructor(
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {
    this.logger = new Logger(UpdateAdministrativeGroupHandler.name);
  }

  async handle(command: UpdateAdministrativeGroupCommand): Promise<void> {
    const studentsToMove: Student[] = [];
    const group = await this.administrativeGroupRepository.get(command.id);

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
      this.logger.verbose('No existe grupo siguiente. Next.');

      return;
    }

    for (const student of group.students) {
      const academicRecord =
        await this.academicRecordRepository.getStudentAcademicRecordByPeriodAndProgram(
          student.id,
          group.academicPeriod.id,
          group.academicProgram.id,
        );

      if (
        academicRecord &&
        academicRecord.status === AcademicRecordStatusEnum.VALID
      ) {
        const enrollments =
          await this.enrollmentRepository.getByAcademicRecordAndBlock(
            academicRecord,
            group.programBlock,
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
          studentsToMove.push(student);
        }
      }
    }
    const uniqueStudentsToMove = [...new Set(studentsToMove)];
    if (uniqueStudentsToMove.length > 0) {
      this.logger.verbose(
        `${uniqueStudentsToMove.length} serán movidos del grupo ${group.code} al grupo ${nextGroup.code}.`,
      );
    }

    await this.administrativeGroupRepository.moveStudents(
      uniqueStudentsToMove,
      group,
      nextGroup,
    );
  }
}
