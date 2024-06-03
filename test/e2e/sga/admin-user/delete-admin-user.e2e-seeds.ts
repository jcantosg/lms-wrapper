import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { v4 as uuid } from 'uuid';
import { Country } from '#shared/domain/entity/country.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

export class DeleteAdminUserE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-delete-admin-user@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'eb542dfe-0b4c-464d-8d7c-82c3a75612ff';
  public static adminUserEmail = 'delete-admin-user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '089585c3-3cc9-4d85-9e27-b733cf4100b2';
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

  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private userRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.userRepository = datasource.getRepository(adminUserSchema);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      DeleteAdminUserE2eSeed.countryId,
      'TEST',
      'TEST',
      DeleteAdminUserE2eSeed.countryName,
      '+12',
      DeleteAdminUserE2eSeed.countryEmoji,
    );
    await this.countryRepository.save(this.country);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      DeleteAdminUserE2eSeed.superAdminUserId,
      DeleteAdminUserE2eSeed.superAdminUserEmail,
      DeleteAdminUserE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.businessUnit = BusinessUnit.create(
      DeleteAdminUserE2eSeed.businessUnitId,
      DeleteAdminUserE2eSeed.businessUnitName,
      DeleteAdminUserE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser.addBusinessUnit(this.businessUnit);
    await this.userRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.adminUser = await createAdminUser(
      this.datasource,
      DeleteAdminUserE2eSeed.adminUserId,
      DeleteAdminUserE2eSeed.adminUserEmail,
      DeleteAdminUserE2eSeed.adminUserPassword,
      [],
      [this.businessUnit],
    );
  }

  async clear(): Promise<void> {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
