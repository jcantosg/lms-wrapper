import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentNotFoundException } from '#student/shared/exception/enrollment-not-found.exception';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class EnrollmentGetter {
  constructor(private readonly repository: EnrollmentRepository) {}

  public async get(id: string): Promise<Enrollment> {
    const enrollment = await this.repository.get(id);
    if (!enrollment) {
      throw new EnrollmentNotFoundException();
    }

    return enrollment;
  }

  public async getByAcademicRecord(
    academicRecord: AcademicRecord,
  ): Promise<Enrollment[]> {
    return await this.repository.getByAcademicRecord(academicRecord);
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

  public async getBySubject(
    subject: Subject,
    adminUser: AdminUser,
  ): Promise<Enrollment[]> {
    return await this.repository.getBySubject(
      subject,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }

  public async getByMultipleSubjects(
    subjects: Subject[],
    adminUser: AdminUser,
  ): Promise<Enrollment[]> {
    return await this.repository.getByMultipleSubjects(
      subjects,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
