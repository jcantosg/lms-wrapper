import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentNotFoundException } from '#student/shared/exception/enrollment-not-found.exception';
import { Student } from '#shared/domain/entity/student.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class EnrollmentGetter {
  constructor(private readonly repository: EnrollmentRepository) {}

  public async get(id: string): Promise<Enrollment> {
    const enrollment = await this.repository.get(id);
    if (!enrollment) {
      throw new EnrollmentNotFoundException();
    }

    return enrollment;
  }

  public async getByStudent(student: Student): Promise<Enrollment[]> {
    const enrollments: Enrollment[] = [];
    await Promise.all([
      student.academicRecords.forEach(async (ar) => {
        enrollments.push(...(await this.repository.getByAcademicRecord(ar)));
      }),
    ]);

    return enrollments;
  }

  public async getByAdminUser(
    enrollmentId: string,
    adminUser: AdminUser,
  ): Promise<Enrollment> {
    const enrollment = await this.repository.getByAdminUser(
      enrollmentId,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (!enrollment) {
      throw new EnrollmentNotFoundException();
    }

    return enrollment;
  }
}
