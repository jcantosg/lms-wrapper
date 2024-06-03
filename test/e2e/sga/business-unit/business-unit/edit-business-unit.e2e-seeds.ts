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
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';

export class EditBusinessUnitE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-edit-business-unit@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'edit-business-unit@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = 'dda38bd6-5d7e-4d85-a8c2-6d130dac9f4b';
  public static businessUnitName = 'Sevilla';
  public static businessUnitCode = 'SEV';
  public static countryId = uuid();
  public static secondCountryId = uuid();

  public static secondBusinessUnitId = '209efe84-a44d-4d3d-9cd1-27d46a5938c2';
  public static secondBusinessUnitName = 'Madrid';
  public static secondBusinessUnitCode = 'MAD01';

  public static virtualCampusId = 'f993b416-37db-4a4a-b934-b26955770c1e';
  public static virtualCampusName = 'Virtual Campus';
  public static virtualCampusCode = 'VC01';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private country: Country;
  private secondCountry: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly virtualCampusRepository: Repository<VirtualCampus>;
  private readonly countryRepository: Repository<Country>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
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
      'TESE',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    this.secondCountry = Country.create(
      EditBusinessUnitE2eSeed.secondCountryId,
      'SEC',
      'SECO',
      'SecondCountry',
      '+1212',
      '🏳Second',
    );
    await this.countryRepository.save(this.country);
    await this.countryRepository.save(this.secondCountry);

    this.businessUnit = BusinessUnit.create(
      EditBusinessUnitE2eSeed.businessUnitId,
      EditBusinessUnitE2eSeed.businessUnitName,
      EditBusinessUnitE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );

    const savedBusinessUnit = await this.businessUnitRepository.save(
      this.businessUnit,
    );
    this.superAdminUser.addBusinessUnit(savedBusinessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.secondBusinessUnit = BusinessUnit.create(
      EditBusinessUnitE2eSeed.secondBusinessUnitId,
      EditBusinessUnitE2eSeed.secondBusinessUnitName,
      EditBusinessUnitE2eSeed.secondBusinessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.virtualCampus = VirtualCampus.create(
      EditBusinessUnitE2eSeed.virtualCampusId,
      EditBusinessUnitE2eSeed.virtualCampusName,
      EditBusinessUnitE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);
  }

  async clear() {
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await this.countryRepository.delete(this.country.id);
    await this.countryRepository.delete(this.secondCountry.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
