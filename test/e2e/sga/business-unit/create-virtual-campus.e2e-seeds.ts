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
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';

export class CreateVirtualCampusE2eSeeds implements E2eSeed {
  public static superAdminUserEmail = 'super-create-virtual-campus@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'eb542dfe-0b4c-464d-8d7c-82c3a75612ff';
  public static adminUserEmail = 'create-virtual-campus@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '089585c3-3cc9-4d85-9e27-b733cf4100b2';
  public static duplicatedBusinessUnitId =
    '53a2138c-7fa0-4da6-b308-7c7b861927ba';
  public static duplicatedBusinessUnitName = 'Barcelona';
  public static duplicatedBusinessUnitCode = 'BCN';
  public static countryId = 'ed081c2d-1168-48d7-90f0-9da85718adb6';
  public static newBusinessUnitId = 'b7556079-fa21-40c7-8e0d-cda9d5864a35';
  public static newVirtualCampusId = '4cf85ac1-ddb2-4a23-8fa9-1277744bbb11';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private duplicatedBusinessUnit: BusinessUnit;
  private country: Country;

  private readonly businessUnitRepository;
  private readonly countryRepository;
  private readonly virtualCampusRepository;
  private readonly examinationCenterRepository;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      CreateVirtualCampusE2eSeeds.adminUserId,
      CreateVirtualCampusE2eSeeds.adminUserEmail,
      CreateVirtualCampusE2eSeeds.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateVirtualCampusE2eSeeds.superAdminUserId,
      CreateVirtualCampusE2eSeeds.superAdminUserEmail,
      CreateVirtualCampusE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        CreateVirtualCampusE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.duplicatedBusinessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        CreateVirtualCampusE2eSeeds.duplicatedBusinessUnitId,
        CreateVirtualCampusE2eSeeds.duplicatedBusinessUnitName,
        CreateVirtualCampusE2eSeeds.duplicatedBusinessUnitCode,
        this.country,
        this.superAdminUser,
      ),
    );
  }

  async clear() {
    await this.virtualCampusRepository.delete({
      businessUnit: { id: CreateVirtualCampusE2eSeeds.newBusinessUnitId },
    });
    await this.businessUnitRepository.delete({
      id: CreateVirtualCampusE2eSeeds.newBusinessUnitId,
    });
    await this.businessUnitRepository.delete({
      id: this.duplicatedBusinessUnit.id,
    });
    await this.countryRepository.delete({ id: this.country.id });
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
