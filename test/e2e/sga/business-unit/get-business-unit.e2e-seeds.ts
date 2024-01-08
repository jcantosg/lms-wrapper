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

export class GetBusinessUnitE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'get-edit-business-unit@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'get-business-unit@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Valencia';
  public static businessUnitCode = 'VAL';
  public static countryId = uuid();
  public static countryEmoji = '🏳️Get';
  public static countryName = 'TestGet';

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
      GetBusinessUnitE2eSeed.adminUserId,
      GetBusinessUnitE2eSeed.adminUserEmail,
      GetBusinessUnitE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetBusinessUnitE2eSeed.superAdminUserId,
      GetBusinessUnitE2eSeed.superAdminUserEmail,
      GetBusinessUnitE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      GetBusinessUnitE2eSeed.countryId,
      'TESG',
      'TESTGET',
      GetBusinessUnitE2eSeed.countryName,
      '+999',
      GetBusinessUnitE2eSeed.countryEmoji,
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetBusinessUnitE2eSeed.businessUnitId,
      GetBusinessUnitE2eSeed.businessUnitName,
      GetBusinessUnitE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );

    await this.businessUnitRepository.save(this.businessUnit);
  }

  async clear() {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
