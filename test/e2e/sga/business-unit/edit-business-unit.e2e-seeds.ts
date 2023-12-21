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

export class EditBusinessUnitE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-edit-business-unit@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'edit-business-unit@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = 'dda38bd6-5d7e-4d85-a8c2-6d130dac9f4b';
  public static businessUnitName = 'Barcelona';
  public static duplicatedBusinessUnitCode1 = 'BCN';
  public static countryId = uuid();

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
      EditBusinessUnitE2eSeed.adminUserId,
      EditBusinessUnitE2eSeed.adminUserEmail,
      EditBusinessUnitE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditBusinessUnitE2eSeed.superAdminUserId,
      EditBusinessUnitE2eSeed.superAdminUserEmail,
      EditBusinessUnitE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      EditBusinessUnitE2eSeed.countryId,
      'TES',
      'TEST',
      'Test',
      '+999',
      '🏳️',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      EditBusinessUnitE2eSeed.businessUnitId,
      EditBusinessUnitE2eSeed.businessUnitName,
      EditBusinessUnitE2eSeed.duplicatedBusinessUnitCode1,
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
