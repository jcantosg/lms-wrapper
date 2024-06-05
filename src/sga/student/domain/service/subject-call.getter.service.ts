import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SubjectCallNotFoundException } from '#shared/domain/exception/subject-call/subject-call.not-found.exception';

export class SubjectCallGetter {
  constructor(private readonly repository: SubjectCallRepository) {}

  public async getByAdminUser(
    id: string,
    adminUser: AdminUser,
  ): Promise<SubjectCall> {
    const subjectCall = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map((businessUnit) => businessUnit.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (!subjectCall) {
      throw new SubjectCallNotFoundException();
    }

    return subjectCall;
  }
}
