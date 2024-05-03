import { Command } from '#shared/domain/bus/command';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditAcademicRecordCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly status: AcademicRecordStatusEnum,
    public readonly modality: AcademicRecordModalityEnum,
    public readonly isModular: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
