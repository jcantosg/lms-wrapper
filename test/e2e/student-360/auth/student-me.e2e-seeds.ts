import { E2eSeed } from '#test/e2e/e2e-seed';
import { Student } from '#shared/domain/entity/student.entity';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';

export class StudentMeE2eSeed implements E2eSeed {
  public static studentId = 'cf665ac9-939e-4ebe-aba4-745dfb469acc';
  public static studentName = 'Samuel';
  public static studentSurname = 'Sanchez';
  public static studentSurname2 = 'Alvarez';
  public static studentEmail = 'samuel@test.org';
  public static studentPassword = 'Universae3€';
  public static studentUniversaeEmail = 'samuel.sanchez@universae.com';
  private student: Student;
  private adminUser: AdminUser;

  private studentRepository: Repository<Student>;

  constructor(private readonly datasource: DataSource) {
    this.studentRepository = datasource.getRepository(studentSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      '125a00b8-4190-4633-83a4-99b495efb937',
      'super-admin@universae.com',
      'test123',
      [AdminUserRoles.SUPERADMIN],
    );
    const passwordEncoder = new BCryptPasswordEncoder();
    this.student = Student.createFromSGA(
      StudentMeE2eSeed.studentId,
      StudentMeE2eSeed.studentName,
      StudentMeE2eSeed.studentSurname,
      StudentMeE2eSeed.studentSurname2,
      StudentMeE2eSeed.studentEmail,
      StudentMeE2eSeed.studentUniversaeEmail,
      this.adminUser,
      await passwordEncoder.encodePassword(StudentMeE2eSeed.studentPassword),
      null,
    );
    await this.studentRepository.save(this.student);
  }

  async clear(): Promise<void> {
    await this.studentRepository.delete(this.student.id);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
