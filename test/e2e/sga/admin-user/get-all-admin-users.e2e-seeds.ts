import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { GetAllAdminUsersE2eSeedDataConfig } from '#test/e2e/sga/admin-user/get-all-admin-users.e2e-seed-data-config';
import { Country } from '#shared/domain/entity/country.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllAdminUsersE2eSeed implements E2eSeed {
  private country: Country;
  private businessUnits: BusinessUnit[];
  private adminUsers: AdminUser[];

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.adminUserRepository = datasource.getRepository(AdminUser);

    this.adminUsers = [];
  }

  async arrange(): Promise<void> {
    for (const baseUser of GetAllAdminUsersE2eSeedDataConfig.adminUsers) {
      this.adminUsers.push(
        await createAdminUser(
          this.datasource,
          baseUser.id,
          baseUser.email,
          '1234',
          baseUser.roles,
          [],
          baseUser.name,
          baseUser.surname,
        ),
      );
    }

    this.country = Country.create(
      GetAllAdminUsersE2eSeedDataConfig.country.id,
      GetAllAdminUsersE2eSeedDataConfig.country.iso,
      GetAllAdminUsersE2eSeedDataConfig.country.iso3,
      GetAllAdminUsersE2eSeedDataConfig.country.name,
      GetAllAdminUsersE2eSeedDataConfig.country.phoneCode,
      GetAllAdminUsersE2eSeedDataConfig.country.emoji,
    );

    await this.countryRepository.save(this.country);

    this.businessUnits = GetAllAdminUsersE2eSeedDataConfig.businessUnits.map(
      (businessUnit) =>
        BusinessUnit.create(
          businessUnit.id,
          businessUnit.name,
          businessUnit.code,
          this.country,
          this.adminUsers[0],
        ),
    );

    const savedBusinessUnits = await this.businessUnitRepository.save(
      this.businessUnits,
    );

    for (const bu of savedBusinessUnits) {
      this.adminUsers[0].addBusinessUnit(bu);
    }

    await this.adminUserRepository.save({
      id: this.adminUsers[0].id,
      businessUnits: this.adminUsers[0].businessUnits,
    });
  }

  async clear() {
    for (const businessUnit of this.businessUnits) {
      await this.businessUnitRepository.delete(businessUnit.id);
    }
    for (const adminUser of this.adminUsers) {
      await removeAdminUser(this.datasource, adminUser);
    }
    await this.countryRepository.delete(this.country.id);
  }
}
