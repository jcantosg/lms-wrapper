import { E2eSeed } from '#test/e2e/e2e-seed';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { DataSource } from 'typeorm';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Country } from '#shared/domain/entity/country.entity';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';

export class CreateExaminationCenterE2eSeeds implements E2eSeed {
  public static superAdminUserEmail =
    'super-create-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'abfddd18-5ab2-411f-b37f-0ee5c22f867e';
  public static adminUserEmail = 'create-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '57fe5b36-b9c8-4412-9e5d-78ccb822677b';
  public static businessUnitId = '53a2138c-7fa0-4da6-b308-7c7b861927ba';
  public static businessUnitName = 'Cartagena';
  public static businessUnitCode = 'CAR';
  public static countryId = 'ed081c2d-1168-48d7-90f0-9da85718adb6';
  public static newExaminationCenterId = '006cfc3d-f7b7-4406-a997-338108001e4c';
  public static businessNotFoundExceptionExaminationCenterId =
    '68d03278-df64-4afa-a482-89336197243e';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private country: Country;

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
    this.adminUserRepository = datasource.getRepository(AdminUser);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      CreateExaminationCenterE2eSeeds.adminUserId,
      CreateExaminationCenterE2eSeeds.adminUserEmail,
      CreateExaminationCenterE2eSeeds.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateExaminationCenterE2eSeeds.superAdminUserId,
      CreateExaminationCenterE2eSeeds.superAdminUserEmail,
      CreateExaminationCenterE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        CreateExaminationCenterE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        CreateExaminationCenterE2eSeeds.businessUnitId,
        CreateExaminationCenterE2eSeeds.businessUnitName,
        CreateExaminationCenterE2eSeeds.businessUnitCode,
        this.country,
        this.superAdminUser,
      ),
    );

    this.superAdminUser.addBusinessUnit(this.businessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });
  }

  async clear() {
    await this.examinationCenterRepository.delete({
      createdBy: { id: this.superAdminUser.id },
    });
    await this.businessUnitRepository.delete({
      id: this.businessUnit.id,
    });
    await this.countryRepository.delete({ id: this.country.id });
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
