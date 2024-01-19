import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class EditExaminationCenterE2eSeed implements E2eSeed {
  public static countryId = uuid();

  public static superAdminUserEmail = 'super-edit-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'edit-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '21c1fb84-ca89-4b20-a646-08dbf32cd06a';
  public static businessUnitCode = 'SEV';
  public static businessUnitName = 'Sevilla';

  public static examinationCenterId = '7baf9fc5-8976-4780-aa07-c0dfb420e230';
  public static examinationCenterName = 'Sevilla';
  public static examinationCenterCode = 'SEV01';

  public static secondExaminationCenterId =
    '84c49037-f0cf-47cb-b567-bfcc0470d3ed';
  public static secondExaminationCenterName = 'Madrid';
  public static secondExaminationCenterCode = 'MAD01';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private examinationCenter: ExaminationCenter;
  private secondExaminationCenter: ExaminationCenter;
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly examinationCenterRepository: Repository<ExaminationCenter>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.examinationCenterRepository =
      datasource.getRepository(ExaminationCenter);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      EditExaminationCenterE2eSeed.adminUserId,
      EditExaminationCenterE2eSeed.adminUserEmail,
      EditExaminationCenterE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditExaminationCenterE2eSeed.superAdminUserId,
      EditExaminationCenterE2eSeed.superAdminUserEmail,
      EditExaminationCenterE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      EditExaminationCenterE2eSeed.countryId,
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      EditExaminationCenterE2eSeed.businessUnitId,
      EditExaminationCenterE2eSeed.businessUnitName,
      EditExaminationCenterE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.examinationCenter = ExaminationCenter.create(
      EditExaminationCenterE2eSeed.examinationCenterId,
      EditExaminationCenterE2eSeed.examinationCenterName,
      EditExaminationCenterE2eSeed.examinationCenterCode,
      [],
      '',
      this.superAdminUser,
      this.country,
    );
    await this.examinationCenterRepository.save(this.examinationCenter);

    this.secondExaminationCenter = ExaminationCenter.create(
      EditExaminationCenterE2eSeed.secondExaminationCenterId,
      EditExaminationCenterE2eSeed.secondExaminationCenterName,
      EditExaminationCenterE2eSeed.secondExaminationCenterCode,
      [],
      '',
      this.superAdminUser,
      this.country,
    );
    await this.examinationCenterRepository.save(this.secondExaminationCenter);
  }

  async clear() {
    await this.examinationCenterRepository.delete(this.examinationCenter.id);
    await this.examinationCenterRepository.delete(
      this.secondExaminationCenter.id,
    );
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(EditExaminationCenterE2eSeed.countryId);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
