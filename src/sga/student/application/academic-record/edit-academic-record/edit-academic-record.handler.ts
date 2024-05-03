import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { EditAcademicRecordCommand } from '#student/application/academic-record/edit-academic-record/edit-academic-record.command';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';

export class EditAcademicRecordHandler implements CommandHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
  ) {}

  async handle(command: EditAcademicRecordCommand) {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      command.id,
      command.adminUser,
    );

    academicRecord.update(
      command.status,
      command.modality,
      command.isModular,
      command.adminUser,
    );

    await this.academicRecordRepository.save(academicRecord);
  }
}
