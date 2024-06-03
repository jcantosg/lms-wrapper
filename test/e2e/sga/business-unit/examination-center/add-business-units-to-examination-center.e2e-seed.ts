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

export class AddBusinessUnitsToExaminationCenterE2eSeeds implements E2eSeed {
  public static superAdminUserEmail =
    'super-add-business-units-to-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = '7dd458fc-3172-47bc-9b39-eab9b7ae8397';

  public static adminUserEmail =
    'add-business-units-to-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '25e42a6f-6979-4ac6-b332-e884afb17b23';

  public static countryId = '3a98c9f1-9a7d-4b35-9cdc-ecc6e019834e';

  public static businessUnitId = 'a5aa93ba-374b-4c5d-b538-87f7553b6cfe';
  public static businessUnitName = 'Cartagena';
  public static businessUnitCode = 'CAR';

  public static examinationCenterId = '02096887-c100-4170-b470-1230b90bcbc4';
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
      AddBusinessUnitsToExaminationCenterE2eSeeds.adminUserId,
      AddBusinessUnitsToExaminationCenterE2eSeeds.adminUserEmail,
      AddBusinessUnitsToExaminationCenterE2eSeeds.adminUserPassword,
      [],
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToExaminationCenterE2eSeeds.superAdminUserId,
      AddBusinessUnitsToExaminationCenterE2eSeeds.superAdminUserEmail,
      AddBusinessUnitsToExaminationCenterE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        AddBusinessUnitsToExaminationCenterE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitId,
        AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitName,
        AddBusinessUnitsToExaminationCenterE2eSeeds.businessUnitCode,
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
      AddBusinessUnitsToExaminationCenterE2eSeeds.examinationCenterId,
      AddBusinessUnitsToExaminationCenterE2eSeeds.examinationCenterName,
      AddBusinessUnitsToExaminationCenterE2eSeeds.examinationCenterCode,
      [],
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
