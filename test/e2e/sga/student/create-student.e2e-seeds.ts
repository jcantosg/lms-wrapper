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
import { MoodleStudentRepository } from '#/lms-wrapper/infrastructure/repository/moodle-student.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { Logger } from '@nestjs/common';

export class CreateStudentE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-student@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-student@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static studentId = uuid();
  public static studentName = 'Samuel';
  public static studentSurname = 'Sanchez';
  public static studentSurname2 = 'Alvarez';
  public static studentEmail = 'samuel@test.org';
  public static studentUniversaeEmail = 'samuel.sanchez@universae.com';

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
  private lmsRepository: MoodleStudentRepository;

  constructor(private readonly datasource: DataSource) {
    this.studentRepository = datasource.getRepository(studentSchema);
    this.lmsRepository = new MoodleStudentRepository(
      new MoodleWrapper(
        new FetchWrapper(process.env.LMS_URL!, new Logger()),
        process.env.LMS_TOKEN!,
      ),
    );
  }

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateStudentE2eSeed.superAdminUserId,
      CreateStudentE2eSeed.superAdminUserEmail,
      CreateStudentE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      CreateStudentE2eSeed.adminUserId,
      CreateStudentE2eSeed.adminUserEmail,
      CreateStudentE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
    );
    this.existingStudent = Student.createFromSGA(
      CreateStudentE2eSeed.existingStudentId,
      CreateStudentE2eSeed.existingStudentName,
      CreateStudentE2eSeed.existingStudentSurname,
      CreateStudentE2eSeed.existingStudentSurname2,
      CreateStudentE2eSeed.existingStudentEmail,
      CreateStudentE2eSeed.existingUniversaeEmail,
      this.superAdminUser,
      'test123',
      null,
    );
    await this.studentRepository.save(this.existingStudent);
  }

  async clear() {
    const student = await this.studentRepository.findOne({
      where: { id: CreateStudentE2eSeed.studentId },
    });
    if (student && student.lmsStudent) {
      await this.lmsRepository.delete(student.lmsStudent.value.id);
    }
    await this.studentRepository.delete(this.existingStudent.id);
    await this.studentRepository.delete(CreateStudentE2eSeed.studentId);

    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
