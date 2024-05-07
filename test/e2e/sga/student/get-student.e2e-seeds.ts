import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { Student } from '#student/domain/entity/student.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetStudentE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'get-student@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static studentUniversaeEmail = 'juan.ros@universae.com';

  public static nonExistingStudentId = uuid();

  private existingStudent: Student;
  private superAdminUser: AdminUser;

  private studentRepository: Repository<Student>;

  constructor(private readonly datasource: DataSource) {
    this.studentRepository = datasource.getRepository(Student);
  }

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetStudentE2eSeed.superAdminUserId,
      GetStudentE2eSeed.superAdminUserEmail,
      GetStudentE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.existingStudent = Student.createFromSGA(
      GetStudentE2eSeed.studentId,
      GetStudentE2eSeed.studentName,
      GetStudentE2eSeed.studentSurname,
      GetStudentE2eSeed.studentSurname2,
      GetStudentE2eSeed.studentEmail,
      GetStudentE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
    );

    await this.studentRepository.save([this.existingStudent]);
  }

  async clear() {
    await this.studentRepository.delete(this.existingStudent.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
