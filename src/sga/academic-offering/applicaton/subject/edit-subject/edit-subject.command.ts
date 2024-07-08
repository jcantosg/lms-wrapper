import { Command } from '#shared/domain/bus/command';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditSubjectCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly hours: number,
    public readonly officialCode: string | null,
    public readonly modality: SubjectModality,
    public readonly evaluationType: string | null,
    public readonly image: string | null,
    public readonly type: SubjectType,
    public readonly isRegulated: boolean,
    public readonly isCore: boolean,
    public readonly adminUser: AdminUser,
    public readonly officialRegionalCode: string | null,
    public readonly lmsCourseId: number | null | undefined,
  ) {}
}
