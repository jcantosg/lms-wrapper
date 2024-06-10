import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { Student } from '#shared/domain/entity/student.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { StudentAcademicRecordNotFoundException } from '#/student/student/domain/exception/student-academic-record-not-found.exception';

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

  async get(id: string) {
    const academicRecord = await this.repository.get(id);
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }

    return academicRecord;
  }

  async getStudentAcademicRecords(
    id: string,
    adminBusinessUnits: string[],
    isSuperAdmin: boolean,
  ) {
    return await this.repository.getStudentAcademicRecords(
      id,
      adminBusinessUnits,
      isSuperAdmin,
    );
  }

  async getStudentAcademicRecord(
    id: string,
    student: Student,
  ): Promise<AcademicRecord> {
    const academicRecord = await this.repository.getByStudent(id, student);
    if (!academicRecord) {
      throw new StudentAcademicRecordNotFoundException();
    }

    return academicRecord;
  }
}
