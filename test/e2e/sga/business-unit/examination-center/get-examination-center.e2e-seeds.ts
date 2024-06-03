import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Country } from '#shared/domain/entity/country.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { classroomSchema } from '#business-unit/infrastructure/config/schema/classroom.schema';

export class GetExaminationCenterE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-get-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'get-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static examinationCenterId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static examinationCenterName = 'Murcia';
  public static examinationCenterCode = 'MUR';
  public static examinationCenterAddress = 'Avenida Principal Parcela 26';
  public static classroomId = '6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5';
  public static classroomName = 'Aula Miguel Hernandez';
  public static classroomCode = 'MIG-MUR';
  public static classroomCapacity = 5;
  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private examinationCenter: ExaminationCenter;
  private country: Country;
  private classroom: Classroom;
  private readonly examinationCenterRepository: Repository<ExaminationCenter>;
  private readonly countryRepository: Repository<Country>;
  private readonly classroomRepository: Repository<Classroom>;

  constructor(private datasource: DataSource) {
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.classroomRepository = datasource.getRepository(classroomSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetExaminationCenterE2eSeed.adminUserId,
      GetExaminationCenterE2eSeed.adminUserEmail,
      GetExaminationCenterE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetExaminationCenterE2eSeed.superAdminUserId,
      GetExaminationCenterE2eSeed.superAdminUserEmail,
      GetExaminationCenterE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      uuid(),
      'TestGet',
      'TESTGET',
      'TESTGET',
      '+999',
      '🏳️',
    );
    await this.countryRepository.save(this.country);

    this.examinationCenter = ExaminationCenter.create(
      GetExaminationCenterE2eSeed.examinationCenterId,
      GetExaminationCenterE2eSeed.examinationCenterName,
      GetExaminationCenterE2eSeed.examinationCenterCode,
      [],
      GetExaminationCenterE2eSeed.examinationCenterAddress,
      this.superAdminUser,
      this.country,
    );
    this.classroom = Classroom.create(
      GetExaminationCenterE2eSeed.classroomId,
      GetExaminationCenterE2eSeed.classroomCode,
      GetExaminationCenterE2eSeed.classroomName,
      GetExaminationCenterE2eSeed.classroomCapacity,
      this.superAdminUser,
      this.examinationCenter,
    );
    await this.examinationCenterRepository.save(this.examinationCenter);
    await this.classroomRepository.save(this.classroom);
  }

  async clear(): Promise<void> {
    await this.classroomRepository.delete(this.classroom.id);
    await this.examinationCenterRepository.delete(this.examinationCenter.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
