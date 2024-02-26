import { Repository, DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { GetAllAcademicPeriodsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/academic-period/get-all-academic-periods.e2e-seed-data-config';

export class GetAllAcademicPeriodsE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriods: AcademicPeriod[];
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicPeriodRepository: Repository<AcademicPeriod>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.adminUserRepository = datasource.getRepository(AdminUser);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetAllAcademicPeriodsE2eSeedDataConfig.admin.userId,
      GetAllAcademicPeriodsE2eSeedDataConfig.admin.email,
      GetAllAcademicPeriodsE2eSeedDataConfig.admin.password,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllAcademicPeriodsE2eSeedDataConfig.superAdmin.userId,
      GetAllAcademicPeriodsE2eSeedDataConfig.superAdmin.email,
      GetAllAcademicPeriodsE2eSeedDataConfig.superAdmin.password,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      GetAllAcademicPeriodsE2eSeedDataConfig.country.id,
      GetAllAcademicPeriodsE2eSeedDataConfig.country.iso,
      GetAllAcademicPeriodsE2eSeedDataConfig.country.iso3,
      GetAllAcademicPeriodsE2eSeedDataConfig.country.name,
      GetAllAcademicPeriodsE2eSeedDataConfig.country.phoneCode,
      GetAllAcademicPeriodsE2eSeedDataConfig.country.emoji,
    );

    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.id,
      GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.name,
      GetAllAcademicPeriodsE2eSeedDataConfig.businessUnit.code,
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

    this.academicPeriods =
      GetAllAcademicPeriodsE2eSeedDataConfig.academicPeriods.map(
        (academicPeriod) =>
          AcademicPeriod.create(
            academicPeriod.id,
            academicPeriod.name,
            academicPeriod.code,
            academicPeriod.startDate,
            academicPeriod.endDate,
            this.businessUnit,
            academicPeriod.blockNumber,
            this.superAdminUser,
          ),
      );

    await this.academicPeriodRepository.save(this.academicPeriods);
  }

  async clear(): Promise<void> {
    const academicPeriodsIds = this.academicPeriods.map((ap) => ap.id);
    await this.academicPeriodRepository.delete(academicPeriodsIds);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
