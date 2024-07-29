import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { Student } from '#shared/domain/entity/student.entity';

export class InternalGroupGetter {
  constructor(private readonly repository: InternalGroupRepository) {}

  async getByAdminUser(
    id: string,
    adminUser: AdminUser,
  ): Promise<InternalGroup> {
    const internalGroup = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (!internalGroup) {
      throw new InternalGroupNotFoundException();
    }

    return internalGroup;
  }

  async getByStudentAndSubject(
    student: Student,
    subject: Subject,
  ): Promise<InternalGroup | null> {
    return await this.repository.getByStudentAndSubject(student.id, subject.id);
  }
}
