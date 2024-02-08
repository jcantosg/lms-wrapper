import { Repository, DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { E2eSeed } from '#test/e2e/e2e-seed';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetAllPlainExaminationCentersE2eSeed implements E2eSeed {
  public static countryId = uuid();

  public static superAdminUserEmail =
    'super-get-all-plain-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'get-all-plain-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static examinationCenterId = '7baf9fc5-8976-4780-aa07-c0dfb420e230';
  public static examinationCenterName = 'Sevilla';
  public static examinationCenterCode = 'SEV01';

  public static secondExaminationCenterId =
    '84c49037-f0cf-47cb-b567-bfcc0470d3ed';
  public static secondExaminationCenterName = 'Madrid';
  public static secondExaminationCenterCode = 'MAD01';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private country: Country;
  private examinationCenter: ExaminationCenter;
  private secondExaminationCenter: ExaminationCenter;

  private readonly countryRepository: Repository<Country>;
  private readonly examinationCenterRepository: Repository<ExaminationCenter>;

  constructor(private readonly datasource: DataSource) {
    this.examinationCenterRepository =
      datasource.getRepository(ExaminationCenter);
    this.countryRepository = datasource.getRepository(Country);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetAllPlainExaminationCentersE2eSeed.adminUserId,
      GetAllPlainExaminationCentersE2eSeed.adminUserEmail,
      GetAllPlainExaminationCentersE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllPlainExaminationCentersE2eSeed.superAdminUserId,
      GetAllPlainExaminationCentersE2eSeed.superAdminUserEmail,
      GetAllPlainExaminationCentersE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      GetAllPlainExaminationCentersE2eSeed.countryId,
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );

    await this.countryRepository.save(this.country);

    this.examinationCenter = ExaminationCenter.create(
      GetAllPlainExaminationCentersE2eSeed.examinationCenterId,
      GetAllPlainExaminationCentersE2eSeed.examinationCenterName,
      GetAllPlainExaminationCentersE2eSeed.examinationCenterCode,
      [],
      '',
      this.superAdminUser,
      this.country,
    );
    await this.examinationCenterRepository.save(this.examinationCenter);

    this.secondExaminationCenter = ExaminationCenter.create(
      GetAllPlainExaminationCentersE2eSeed.secondExaminationCenterId,
      GetAllPlainExaminationCentersE2eSeed.secondExaminationCenterName,
      GetAllPlainExaminationCentersE2eSeed.secondExaminationCenterCode,
      [],
      '',
      this.superAdminUser,
      this.country,
    );
    await this.examinationCenterRepository.save(this.secondExaminationCenter);
  }

  async clear(): Promise<void> {
    await this.examinationCenterRepository.delete(this.examinationCenter.id);
    await this.examinationCenterRepository.delete(
      this.secondExaminationCenter.id,
    );
    await this.countryRepository.delete(
      GetAllPlainExaminationCentersE2eSeed.countryId,
    );
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
