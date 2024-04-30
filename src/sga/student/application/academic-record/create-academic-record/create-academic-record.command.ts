import { Command } from '#shared/domain/bus/command';
import { AcademicRecordModalityEnum } from '#academic-offering/domain/enum/academic-record-modality.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateAcademicRecordCommand implements Command {
  constructor(
    public readonly id: string,
    public businessUnitId: string,
    public virtualCampusId: string,
    public readonly studentId: string,
    public readonly academicPeriodId: string,
    public readonly academicProgramId: string,
    public readonly academicRecordModality: AcademicRecordModalityEnum,
    public readonly isModular: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
