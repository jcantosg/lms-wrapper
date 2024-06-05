import { E2eSeed } from '#test/e2e/e2e-seed';
import { Student } from '#shared/domain/entity/student.entity';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { StudentRecoveryPasswordToken } from '#/student/student/domain/entity/student-recovery-password-token.entity';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { studentRecoveryPasswordTokenSchema } from '#/student/student/infrastructure/config/schema/student-recovery-password-token.schema';

export class GenerateStudentRecoveryPasswordTokenSeed implements E2eSeed {
  private static studentId = 'cf665ac9-939e-4ebe-aba4-745dfb469acc';
  private static studentName = 'Juan';
  private static studentSurname = 'Ros';
  private static studentSurname2 = 'Lopez';
  private static studentEmail = 'juan@test.com';
  private static studentPassword = 'test123';
  public static studentUniversaeEmail = 'juan@universae.com';
  private student: Student;
  private adminUser: AdminUser;

  private studentRepository: Repository<Student>;
  private studentRecoveryPasswordTokenRepository: Repository<StudentRecoveryPasswordToken>;

  constructor(private readonly datasource: DataSource) {
    this.studentRepository = datasource.getRepository(studentSchema);
    this.studentRecoveryPasswordTokenRepository = datasource.getRepository(
      studentRecoveryPasswordTokenSchema,
    );
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      '125a00b8-4190-4633-83a4-99b495efb937',
      'super-admin@universae.com',
      'test123',
      [AdminUserRoles.SUPERADMIN],
    );
    this.student = Student.createFromCRM(
      GenerateStudentRecoveryPasswordTokenSeed.studentId,
      GenerateStudentRecoveryPasswordTokenSeed.studentName,
      GenerateStudentRecoveryPasswordTokenSeed.studentSurname,
      GenerateStudentRecoveryPasswordTokenSeed.studentSurname2,
      GenerateStudentRecoveryPasswordTokenSeed.studentEmail,
      GenerateStudentRecoveryPasswordTokenSeed.studentPassword,
      GenerateStudentRecoveryPasswordTokenSeed.studentUniversaeEmail,
      'crm-id',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.adminUser,
    );
    await this.studentRepository.save(this.student);
  }

  async clear(): Promise<void> {
    const recoveryPasswordTokens =
      await this.studentRecoveryPasswordTokenRepository.find();
    await this.studentRecoveryPasswordTokenRepository.delete(
      recoveryPasswordTokens.map(
        (recoveryPasswordToken) => recoveryPasswordToken.id,
      ),
    );
    await this.studentRepository.delete(this.student.id);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
