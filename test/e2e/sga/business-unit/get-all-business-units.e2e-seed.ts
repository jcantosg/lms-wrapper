import { Repository, DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { createAdminUser, removeAdminUser } from '../e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllBusinessUnitsE2eSeedDataConfig } from './seed-data-config/get-all-business-units.e2e-seed-data-config';

export class GetAllBusinessUnitsE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnits: BusinessUnit[];
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.adminUserRepository = datasource.getRepository(AdminUser);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetAllBusinessUnitsE2eSeedDataConfig.admin.userId,
      GetAllBusinessUnitsE2eSeedDataConfig.admin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.admin.password,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.userId,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.password,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      GetAllBusinessUnitsE2eSeedDataConfig.country.id,
      GetAllBusinessUnitsE2eSeedDataConfig.country.iso,
      GetAllBusinessUnitsE2eSeedDataConfig.country.iso3,
      GetAllBusinessUnitsE2eSeedDataConfig.country.name,
      GetAllBusinessUnitsE2eSeedDataConfig.country.phoneCode,
      GetAllBusinessUnitsE2eSeedDataConfig.country.emoji,
    );

    await this.countryRepository.save(this.country);

    this.businessUnits = GetAllBusinessUnitsE2eSeedDataConfig.businessUnits.map(
      (businessUnit) =>
        BusinessUnit.create(
          businessUnit.id,
          businessUnit.name,
          businessUnit.code,
          this.country,
          this.superAdminUser,
        ),
    );

    const savedBusinessUnits = await this.businessUnitRepository.save(
      this.businessUnits,
    );

    for (const bu of savedBusinessUnits) {
      this.superAdminUser.addBusinessUnit(bu);
    }

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });
  }

  async clear(): Promise<void> {
    const businessUnitsIds = this.businessUnits.map((bu) => bu.id);
    await this.businessUnitRepository.delete(businessUnitsIds);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
