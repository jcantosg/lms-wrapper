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

export class UpdateStudentPasswordE2eSeed implements E2eSeed {
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
      UpdateStudentPasswordE2eSeed.superAdminUserId,
      UpdateStudentPasswordE2eSeed.superAdminUserEmail,
      UpdateStudentPasswordE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      UpdateStudentPasswordE2eSeed.adminUserId,
      UpdateStudentPasswordE2eSeed.adminUserEmail,
      UpdateStudentPasswordE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
    );
    this.existingStudent = Student.createFromSGA(
      UpdateStudentPasswordE2eSeed.existingStudentId,
      UpdateStudentPasswordE2eSeed.existingStudentName,
      UpdateStudentPasswordE2eSeed.existingStudentSurname,
      UpdateStudentPasswordE2eSeed.existingStudentSurname2,
      UpdateStudentPasswordE2eSeed.existingStudentEmail,
      UpdateStudentPasswordE2eSeed.existingUniversaeEmail,
      this.superAdminUser,
      'test123',
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
