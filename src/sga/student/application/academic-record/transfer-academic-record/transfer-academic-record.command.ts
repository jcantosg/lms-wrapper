import { Command } from '#shared/domain/bus/command';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { File } from '#shared/domain/file-manager/file';

export class TransferAcademicRecordCommand implements Command {
  constructor(
    public readonly oldAcademicRecordId: string,
    public readonly newAcademicRecordId: string,
    public readonly businessUnitId: string,
    public readonly virtualCampusId: string,
    public readonly academicPeriodId: string,
    public readonly academicProgramId: string,
    public readonly modality: AcademicRecordModalityEnum,
    public readonly isModular: boolean,
    public readonly comments: string,
    public readonly files: File[],
    public readonly adminUser: AdminUser,
  ) {}
}
