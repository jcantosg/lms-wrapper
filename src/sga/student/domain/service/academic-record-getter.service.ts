import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';

export class AcademicRecordGetter {
  constructor(private readonly repository: AcademicRecordRepository) {}

  async getByAdminUser(id: string, adminUser: AdminUser) {
    const academicRecord = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }

    return academicRecord;
  }
}
