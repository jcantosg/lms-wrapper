import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { Student } from '#shared/domain/entity/student.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';

export class UpdateProfileE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-student@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-student@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static existingStudentId = uuid();
  public static existingStudentName = 'Juan';
  public static existingStudentSurname = 'Ros';
  public static existingStudentSurname2 = 'Lopez';
  public static existingStudentEmail = 'juan@test.org';
  public static existingUniversaeEmail = 'juan.ros@universae.com';
  public static existingStudentPassword = 'test123';

  private existingStudent: Student;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private studentRepository: Repository<Student>;

  constructor(private readonly datasource: DataSource) {
    this.studentRepository = datasource.getRepository(studentSchema);
  }

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      UpdateProfileE2eSeed.superAdminUserId,
      UpdateProfileE2eSeed.superAdminUserEmail,
      UpdateProfileE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      UpdateProfileE2eSeed.adminUserId,
      UpdateProfileE2eSeed.adminUserEmail,
      UpdateProfileE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
    );
    const passwordEncoder = new BCryptPasswordEncoder();

    this.existingStudent = Student.createFromSGA(
      UpdateProfileE2eSeed.existingStudentId,
      UpdateProfileE2eSeed.existingStudentName,
      UpdateProfileE2eSeed.existingStudentSurname,
      UpdateProfileE2eSeed.existingStudentSurname2,
      UpdateProfileE2eSeed.existingStudentEmail,
      UpdateProfileE2eSeed.existingUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(
        UpdateProfileE2eSeed.existingStudentPassword,
      ),
      null,
    );

    await this.studentRepository.save([this.existingStudent]);
  }

  async clear() {
    await this.studentRepository.delete(this.existingStudent.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
