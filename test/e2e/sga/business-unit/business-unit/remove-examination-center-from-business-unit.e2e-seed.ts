import { DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { Country } from '#shared/domain/entity/country.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

export class RemoveExaminationCentersFromBusinessUnitE2eSeeds
  implements E2eSeed
{
  public static superAdminUserEmail =
    'super-add-examination-centers-to-business-unit@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'c8b75638-e6eb-4b87-9222-7ba66bfe8d81';

  public static adminUserEmail =
    'add-examination-centers-to-business-unit@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '1b0f7f2d-118a-4139-96d4-7780217e0f89';

  public static countryId = 'de745c05-6fc8-454f-9347-6b129d0fbc25';

  public static businessUnitId = 'ab151b65-af1c-4e85-a939-a46ba4ed8095';
  public static businessUnitName = 'Cartagena';
  public static businessUnitCode = 'CAR';

  public static examinationCenterMainId =
    '10bf8e4b-ac53-45b2-bc52-41ef206b065b';
  public static examinationCenterMainCode = 'Car01';

  public static examinationCenterId = 'f3a4911a-2f76-44cc-ab9c-61e0f1e3ef91';
  public static examinationCenterName = 'Canarias';
  public static examinationCenterCode = 'CAN01';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private country: Country;
  private businessUnit: BusinessUnit;
  private examinationCenterMain: ExaminationCenter;
  private examinationCenter: ExaminationCenter;

  private readonly businessUnitRepository;
  private readonly countryRepository;
  private readonly examinationCenterRepository;
  private readonly adminUserRepository;

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
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.adminUserId,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.adminUserEmail,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.adminUserPassword,
      [],
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.superAdminUserId,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.superAdminUserEmail,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        RemoveExaminationCentersFromBusinessUnitE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        RemoveExaminationCentersFromBusinessUnitE2eSeeds.businessUnitId,
        RemoveExaminationCentersFromBusinessUnitE2eSeeds.businessUnitName,
        RemoveExaminationCentersFromBusinessUnitE2eSeeds.businessUnitCode,
        this.country,
        this.superAdminUser,
      ),
    );

    this.superAdminUser.addBusinessUnit(this.businessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.examinationCenterMain = ExaminationCenter.createFromBusinessUnit(
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterMainId,
      this.businessUnit,
      this.superAdminUser,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterMainCode,
    );

    this.examinationCenter = ExaminationCenter.create(
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterId,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterName,
      RemoveExaminationCentersFromBusinessUnitE2eSeeds.examinationCenterCode,
      [this.businessUnit],
      'address',
      this.superAdminUser,
      this.country,
    );

    await this.examinationCenterRepository.save(this.examinationCenterMain);
    await this.examinationCenterRepository.save(this.examinationCenter);
  }

  async clear() {
    await this.examinationCenterRepository.delete({
      id: this.examinationCenterMain.id,
    });

    await this.examinationCenterRepository.delete({
      id: this.examinationCenter.id,
    });

    await this.businessUnitRepository.delete({
      id: this.businessUnit.id,
    });

    await this.countryRepository.delete({ id: this.country.id });
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
