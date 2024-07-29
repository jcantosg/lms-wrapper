import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class GetSubjectsByBusinessUnitQuery implements Query {
  constructor(
    public readonly businessUnitId: string,
    public readonly academicProgramId: string,
    public readonly adminUser: AdminUser,
    public readonly subjectType?: SubjectType,
  ) {}
}
