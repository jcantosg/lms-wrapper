import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { DataSource, Repository } from 'typeorm';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';

export class GetCountriesE2ESeed implements E2eSeed {
  public static superAdminUserEmail = 'get-countries-superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'get-countries-admin@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static countryId = uuid();
  public static countryEmoji = '🏳️GetId';
  public static countryName = 'TestGetId';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetCountriesE2ESeed.adminUserId,
      GetCountriesE2ESeed.adminUserEmail,
      GetCountriesE2ESeed.adminUserPassword,
      [],
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetCountriesE2ESeed.superAdminUserId,
      GetCountriesE2ESeed.superAdminUserEmail,
      GetCountriesE2ESeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      GetCountriesE2ESeed.countryId,
      'AA',
      'AAA',
      GetCountriesE2ESeed.countryName,
      '+89',
      GetCountriesE2ESeed.countryEmoji,
    );

    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetCountriesE2ESeed.businessUnitId,
      GetCountriesE2ESeed.businessUnitName,
      GetCountriesE2ESeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
  }

  async clear(): Promise<void> {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
