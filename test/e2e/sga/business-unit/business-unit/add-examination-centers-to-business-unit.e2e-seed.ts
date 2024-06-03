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

export class AddExaminationCentersToBusinessUnitE2eSeeds implements E2eSeed {
  public static superAdminUserEmail =
    'super-add-examination-centers-to-business-unit@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = '7a1b72a8-e4ae-4558-a9fb-65b597bfa2f7';

  public static adminUserEmail =
    'add-examination-centers-to-business-unit@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '0d048d69-5c1c-47b9-adfc-79d8794b6fc8';

  public static countryId = 'ed081c2d-1168-48d7-90f0-9da85718adb6';

  public static businessUnitId = 'b8d48d2a-7bab-4ef9-b30a-9eebf75ccae5';
  public static businessUnitName = 'Cartagena';
  public static businessUnitCode = 'CAR';

  public static examinationCenterId = 'ad82ff10-9e15-46bf-8cca-9a7c5d9ab695';
  public static examinationCenterName = 'Centro de examen 1';
  public static examinationCenterCode = 'CE1';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private country: Country;
  private businessUnit: BusinessUnit;
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
      AddExaminationCentersToBusinessUnitE2eSeeds.adminUserId,
      AddExaminationCentersToBusinessUnitE2eSeeds.adminUserEmail,
      AddExaminationCentersToBusinessUnitE2eSeeds.adminUserPassword,
      [],
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddExaminationCentersToBusinessUnitE2eSeeds.superAdminUserId,
      AddExaminationCentersToBusinessUnitE2eSeeds.superAdminUserEmail,
      AddExaminationCentersToBusinessUnitE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        AddExaminationCentersToBusinessUnitE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        AddExaminationCentersToBusinessUnitE2eSeeds.businessUnitId,
        AddExaminationCentersToBusinessUnitE2eSeeds.businessUnitName,
        AddExaminationCentersToBusinessUnitE2eSeeds.businessUnitCode,
        this.country,
        this.superAdminUser,
      ),
    );

    this.superAdminUser.addBusinessUnit(this.businessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.examinationCenter = ExaminationCenter.create(
      AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterId,
      AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterName,
      AddExaminationCentersToBusinessUnitE2eSeeds.examinationCenterCode,
      [],
      '',
      this.superAdminUser,
      this.country,
    );

    await this.examinationCenterRepository.save(this.examinationCenter);
  }

  async clear() {
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
