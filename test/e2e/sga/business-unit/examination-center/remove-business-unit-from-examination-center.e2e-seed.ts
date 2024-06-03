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

export class RemoveBusinessUnitFromExaminationCenterE2eSeeds
  implements E2eSeed
{
  public static superAdminUserEmail =
    'super-remove-business-unit-from-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'f74232d6-cbcc-4771-88b8-030f9618bb83';

  public static adminUserEmail =
    'remove-business-unit-from-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '9edb241f-fc48-4ec8-a25e-66146b445eb1';

  public static countryId = '4791c9fa-e471-48aa-a350-027a06103d2b';

  public static businessUnitId = '2cc8c859-504b-4025-b6c1-c6266a5b9b38';
  public static businessUnitName = 'Cartagena';
  public static businessUnitCode = 'CAR';

  public static examinationCenterId = 'a6beb944-d662-4342-b578-61d55d23838a';
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
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.adminUserId,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.adminUserEmail,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.adminUserPassword,
      [],
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.superAdminUserId,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.superAdminUserEmail,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        RemoveBusinessUnitFromExaminationCenterE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        RemoveBusinessUnitFromExaminationCenterE2eSeeds.businessUnitId,
        RemoveBusinessUnitFromExaminationCenterE2eSeeds.businessUnitName,
        RemoveBusinessUnitFromExaminationCenterE2eSeeds.businessUnitCode,
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
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.examinationCenterId,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.examinationCenterName,
      RemoveBusinessUnitFromExaminationCenterE2eSeeds.examinationCenterCode,
      [this.businessUnit],
      '',
      this.superAdminUser,
      this.country,
    );

    await this.examinationCenterRepository.save(this.examinationCenter);
  }

  async clear(): Promise<void> {
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
