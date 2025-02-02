import { Command } from '#shared/domain/bus/command';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateAcademicRecordCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly businessUnitId: string,
    public readonly virtualCampusId: string,
    public readonly studentId: string,
    public readonly academicPeriodId: string,
    public readonly academicProgramId: string,
    public readonly academicRecordModality: AcademicRecordModalityEnum,
    public readonly isModular: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
