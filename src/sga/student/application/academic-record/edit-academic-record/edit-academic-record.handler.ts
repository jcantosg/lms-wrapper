import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { EditAcademicRecordCommand } from '#student/application/academic-record/edit-academic-record/edit-academic-record.command';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';
import { StudentAdministrativeGroupByAcademicRecordGetter } from '#student/domain/service/student-administrative-group-by-academic-record.getter.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export class EditAcademicRecordHandler implements CommandHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentAdministrativeGroupGetter: StudentAdministrativeGroupByAcademicRecordGetter,
    private readonly enrollmentGetter: EnrollmentGetter,
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly transactionalService: TransactionalService,
  ) {}

  async handle(command: EditAcademicRecordCommand) {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      command.id,
      command.adminUser,
    );

    if (academicRecord.status === AcademicRecordStatusEnum.CANCELLED) {
      throw new AcademicRecordCancelledException();
    }

    academicRecord.update(
      command.status,
      command.modality,
      command.isModular,
      command.adminUser,
    );

    if (command.status === AcademicRecordStatusEnum.CANCELLED) {
      return await this.cancelAcademicRecord(academicRecord);
    }

    await this.academicRecordRepository.save(academicRecord);
  }

  private async cancelAcademicRecord(academicRecord: AcademicRecord) {
    const administrativeGroup = await this.studentAdministrativeGroupGetter.get(
      academicRecord.id,
    );

    if (administrativeGroup) {
      administrativeGroup.removeStudent(academicRecord.student);
    }

    const enrollments =
      await this.enrollmentGetter.getByAcademicRecord(academicRecord);

    const internalGroups =
      await this.internalGroupRepository.getAllByStudentAndKeys(
        academicRecord.student.id,
        academicRecord.academicPeriod,
        academicRecord.academicProgram,
      );

    internalGroups.forEach((group) =>
      group.removeStudent(academicRecord.student),
    );

    return await this.transactionalService.execute({
      academicRecord,
      enrollments,
      internalGroups,
      administrativeGroup,
    });
  }
}
