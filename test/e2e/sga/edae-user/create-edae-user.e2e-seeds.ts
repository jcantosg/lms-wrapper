import { DataSource, Repository } from 'typeorm';
import { EdaeUser } from '#/sga/edae-user/domain/entity/edae-user.entity';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

export class CreateEdaeUserE2eSeed implements E2eSeed {
  public static newEdaeUserId = '747f51fe-cc5f-48f3-9ec7-f77368b17fcb';
  public static newEdaeUserEmail = 'edaeuser@example.com';
  public static newEdaeUserName = 'TestEdae';
  public static newEdaeUserSurname1 = 'UserSurname';
  public static newEdaeUserSurname2 = 'SecondSurname';
  public static newEdaeUserIdentityDocument = getAnIdentityDocument().value;
  public static newEdaeUserRoles = [EdaeRoles.DOCENTE];
  public static newEdaeUserBusinessUnits = [
    '5a97489a-c46d-4ea0-89e9-b382c1ab60ff',
  ];
  public static newEdaeUserTimeZone = TimeZoneEnum.GMT_MINUS_1;
  public static newEdaeUserIsRemote = true;

  public static countryId = '34bf728e-745a-4a0e-9235-80627fb225dc';
  private country: Country;

  public static businessUnitId = '5a97489a-c46d-4ea0-89e9-b382c1ab60ff';
  public static businessUnitName = 'Shangai';
  public static businessUnitCode = 'SH01';
  private businessUnit: BusinessUnit;

  private superAdminUser: AdminUser;
  public static superAdminUserMail: string =
    'SuperAdminUserTestMail@universae.com';
  public static superAdminUserId: string =
    'd506b063-f57d-4e47-a91e-a83e06762741';
  public static superAdminUserPassword: string = 'test1234';

  private adminUser: AdminUser;
  public static adminUserMail: string = 'adminUserTestMail@universae.com';
  public static adminUserId: string = '14febc28-539a-47ae-b4f6-7ffa81a0fa8d';
  public static adminUserPassword: string = 'test1234';

  private edaeUserRepository: Repository<EdaeUser>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private adminUserRepository: Repository<AdminUser>;

  constructor(private datasource: DataSource) {
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      CreateEdaeUserE2eSeed.countryId,
      'marte',
      'ZZZ',
      'Marte',
      '987',
      ':)',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      CreateEdaeUserE2eSeed.businessUnitId,
      CreateEdaeUserE2eSeed.businessUnitName,
      CreateEdaeUserE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateEdaeUserE2eSeed.superAdminUserId,
      CreateEdaeUserE2eSeed.superAdminUserMail,
      CreateEdaeUserE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateEdaeUserE2eSeed.adminUserId,
      CreateEdaeUserE2eSeed.adminUserMail,
      CreateEdaeUserE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
    );
  }

  async clear(): Promise<void> {
    await this.edaeUserRepository.delete(CreateEdaeUserE2eSeed.newEdaeUserId);
    await this.businessUnitRepository.delete(
      CreateEdaeUserE2eSeed.businessUnitId,
    );
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(CreateEdaeUserE2eSeed.countryId);
  }
}
