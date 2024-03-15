import { Command } from '#shared/domain/bus/command';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class CreateSubjectCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly image: string | null,
    public readonly officialCode: string | null,
    public readonly hours: number,
    public readonly modality: SubjectModality,
    public readonly evaluationTypeId: string | null,
    public readonly type: SubjectType,
    public readonly businessUnitId: string,
    public readonly isRegulated: boolean | null,
    public readonly isCore: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
