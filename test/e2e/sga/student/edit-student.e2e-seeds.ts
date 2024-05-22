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

export class EditStudentE2eSeed implements E2eSeed {
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

  public static secondExistingStudentId = uuid();
  public static secondExistingStudentName = 'Samuel';
  public static secondExistingStudentSurname = 'Sánchez';
  public static secondExistingStudentSurname2 = 'Álvarez';
  public static secondExistingStudentEmail = 'samuel@test.org';
  public static secondExistingUniversaeEmail = 'samuel.sanchez@universae.com';

  private existingStudent: Student;
  private secondExistingStudent: Student;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private studentRepository: Repository<Student>;

  constructor(private readonly datasource: DataSource) {
    this.studentRepository = datasource.getRepository(Student);
  }

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditStudentE2eSeed.superAdminUserId,
      EditStudentE2eSeed.superAdminUserEmail,
      EditStudentE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      EditStudentE2eSeed.adminUserId,
      EditStudentE2eSeed.adminUserEmail,
      EditStudentE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
    );
    this.existingStudent = Student.createFromSGA(
      EditStudentE2eSeed.existingStudentId,
      EditStudentE2eSeed.existingStudentName,
      EditStudentE2eSeed.existingStudentSurname,
      EditStudentE2eSeed.existingStudentSurname2,
      EditStudentE2eSeed.existingStudentEmail,
      EditStudentE2eSeed.existingUniversaeEmail,
      this.superAdminUser,
      'test123',
    );
    this.secondExistingStudent = Student.createFromSGA(
      EditStudentE2eSeed.secondExistingStudentId,
      EditStudentE2eSeed.secondExistingStudentName,
      EditStudentE2eSeed.secondExistingStudentSurname,
      EditStudentE2eSeed.secondExistingStudentSurname2,
      EditStudentE2eSeed.secondExistingStudentEmail,
      EditStudentE2eSeed.secondExistingUniversaeEmail,
      this.superAdminUser,
      'test123',
    );
    await this.studentRepository.save([
      this.existingStudent,
      this.secondExistingStudent,
    ]);
  }

  async clear() {
    await this.studentRepository.delete(this.existingStudent.id);
    await this.studentRepository.delete(this.secondExistingStudent.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
