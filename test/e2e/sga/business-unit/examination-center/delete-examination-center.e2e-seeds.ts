import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllBusinessUnitsE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-business-units.e2e-seed-data-config';
import { Country } from '#shared/domain/entity/country.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';

export class DeleteExaminationCenterE2eSeeds implements E2eSeed {
  public static examinationCenterId = '1c63d7a9-c0f4-4a5e-9e76-c6ce6f904dd1';
  public static examinationCenterName = 'Name';
  public static examinationCenterCode = 'NAM01';
  public static examinationCenterAddress = 'address';

  public static mainExaminationCenterId =
    'dd686ce4-42be-4ab1-af6b-87400397f672';

  public static mainExaminationCenterCode = 'MAI01';

  public static businessUnitId = '53a2138c-7fa0-4da6-b308-7c7b861927ba';
  public static businessUnitName = 'Barcelona';
  public static businessUniCode = 'BCN';

  private superAdminUser: AdminUser;
  private country: Country;
  private businessUnit: BusinessUnit;

  private examinationCenterRepository: Repository<ExaminationCenter>;
  private examinationCenter: ExaminationCenter;
  private mainExaminationCenter: ExaminationCenter;
  private readonly countryRepository: Repository<Country>;
  private readonly businessUnitRepository: Repository<BusinessUnit>;

  constructor(private readonly datasource: DataSource) {
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.userId,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.password,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      uuid(),
      'TestGet',
      'TESTGET',
      'TESTGET',
      '+999',
      '🏳️',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      DeleteExaminationCenterE2eSeeds.businessUnitId,
      DeleteExaminationCenterE2eSeeds.businessUnitName,
      DeleteExaminationCenterE2eSeeds.businessUniCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.examinationCenter = ExaminationCenter.create(
      DeleteExaminationCenterE2eSeeds.examinationCenterId,
      DeleteExaminationCenterE2eSeeds.examinationCenterName,
      DeleteExaminationCenterE2eSeeds.examinationCenterCode,
      [],
      DeleteExaminationCenterE2eSeeds.examinationCenterAddress,
      this.superAdminUser,
      this.country,
    );
    this.mainExaminationCenter = ExaminationCenter.createFromBusinessUnit(
      DeleteExaminationCenterE2eSeeds.mainExaminationCenterId,
      this.businessUnit,
      this.superAdminUser,
      DeleteExaminationCenterE2eSeeds.mainExaminationCenterCode,
    );
    await this.examinationCenterRepository.save(this.examinationCenter);
    await this.examinationCenterRepository.save(this.mainExaminationCenter);
  }

  async clear(): Promise<void> {
    await this.examinationCenterRepository.delete({
      id: DeleteExaminationCenterE2eSeeds.examinationCenterId,
    });
    await this.examinationCenterRepository.delete({
      id: DeleteExaminationCenterE2eSeeds.mainExaminationCenterId,
    });
    await this.businessUnitRepository.delete({
      id: DeleteExaminationCenterE2eSeeds.businessUnitId,
    });
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
