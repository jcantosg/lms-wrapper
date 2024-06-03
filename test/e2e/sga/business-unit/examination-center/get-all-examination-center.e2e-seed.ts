import { Repository, DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { GetAllExaminationCentersE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-examination-centers.e2e-seed-data-config';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

export class GetAllExaminationCentersE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private examinationCenters: ExaminationCenter[];
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly examinationCenterRepository: Repository<ExaminationCenter>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetAllExaminationCentersE2eSeedDataConfig.admin.userId,
      GetAllExaminationCentersE2eSeedDataConfig.admin.email,
      GetAllExaminationCentersE2eSeedDataConfig.admin.password,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.userId,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.email,
      GetAllExaminationCentersE2eSeedDataConfig.superAdmin.password,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      GetAllExaminationCentersE2eSeedDataConfig.country.id,
      GetAllExaminationCentersE2eSeedDataConfig.country.iso,
      GetAllExaminationCentersE2eSeedDataConfig.country.iso3,
      GetAllExaminationCentersE2eSeedDataConfig.country.name,
      GetAllExaminationCentersE2eSeedDataConfig.country.phoneCode,
      GetAllExaminationCentersE2eSeedDataConfig.country.emoji,
    );

    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetAllExaminationCentersE2eSeedDataConfig.businessUnit.id,
      GetAllExaminationCentersE2eSeedDataConfig.businessUnit.name,
      GetAllExaminationCentersE2eSeedDataConfig.businessUnit.code,
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

    this.examinationCenters =
      GetAllExaminationCentersE2eSeedDataConfig.examinationCenters.map(
        (examinationCenter) =>
          ExaminationCenter.create(
            examinationCenter.id,
            examinationCenter.name,
            examinationCenter.code,
            [this.businessUnit],
            examinationCenter.address,
            this.superAdminUser,
            this.country,
          ),
      );

    await this.examinationCenterRepository.save(this.examinationCenters);
  }

  async clear(): Promise<void> {
    const examinationCentersIds = this.examinationCenters.map((ec) => ec.id);
    await this.examinationCenterRepository.delete(examinationCentersIds);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
