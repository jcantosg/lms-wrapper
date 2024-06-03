import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { AddBusinessUnitsToAdminUserE2eSeedDataConfig } from '#test/e2e/sga/admin-user/seed-data-config/add-business-units-to-admin-user.e2e-seed-data-config';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

export class RemoveBusinessUnitFromAdminUserE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private gestor360User: AdminUser;
  private supervisor360User: AdminUser;
  private secretariaUser: AdminUser;
  private businessUnits: BusinessUnit[];
  private spainCountry: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.userId,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.password,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.roles,
    );

    this.gestor360User = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.userId,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.password,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360User.roles,
    );

    this.supervisor360User = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.supervisor360User.userId,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.supervisor360User.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.supervisor360User.password,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.supervisor360User.roles,
    );

    this.secretariaUser = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.secretariaUser.userId,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.secretariaUser.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.secretariaUser.password,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.secretariaUser.roles,
    );

    this.spainCountry = (await this.countryRepository.findOne({
      where: {
        iso: 'ES',
      },
    })) as Country;

    this.businessUnits =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.map(
        (businessUnit) =>
          BusinessUnit.create(
            businessUnit.id,
            businessUnit.name,
            businessUnit.code,
            this.spainCountry,
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

    await this.adminUserRepository.save({
      id: this.gestor360User.id,
      businessUnits: this.superAdminUser.businessUnits.filter(
        (bu) => bu.code === 'MAD' || bu.code === 'BAR',
      ),
    });

    await this.adminUserRepository.save({
      id: this.supervisor360User.id,
      businessUnits: this.superAdminUser.businessUnits.filter(
        (bu) => bu.code === 'BAR' || bu.code === 'MAD',
      ),
    });

    await this.adminUserRepository.save({
      id: this.secretariaUser.id,
      businessUnits: this.superAdminUser.businessUnits.filter(
        (bu) => bu.code === 'MAD',
      ),
    });
  }

  async clear(): Promise<void> {
    const businessUnitsIds = this.businessUnits.map((bu) => bu.id);
    await this.businessUnitRepository.delete(businessUnitsIds);
    await removeAdminUser(this.datasource, this.gestor360User);
    await removeAdminUser(this.datasource, this.supervisor360User);
    await removeAdminUser(this.datasource, this.secretariaUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
