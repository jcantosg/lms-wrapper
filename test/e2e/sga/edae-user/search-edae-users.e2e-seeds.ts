import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import datasource from '#config/ormconfig';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';

export class SearchEdaeUsersE2eSeed implements E2eSeed {
  public static countryId = uuid();

  public static superAdminUserEmail =
    'super-search-edae-users-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'search-edae-users@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static firstEdaeUserId = uuid();
  public static firstEdaeUserName = 'edae1';
  public static firstEdaeUserSurname1 = 'edae-user-surname1';
  public static firstEdaeuUserEmail = 'edae-user-1@universae.com';
  public static secondEdaeUserId = uuid();
  public static secondEdaeUserName = 'edae2';
  public static secondEdaeUserSurname1 = 'edae-user-2-surname1';
  public static secondEdaeuUserEmail = 'edae-user-2@universae.com';
  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private country: Country;
  public firstUser: EdaeUser;
  public secondUser: EdaeUser;
  private readonly edaeUserRepository: Repository<EdaeUser>;
  private readonly countryRepository: Repository<Country>;
  private readonly businessUnitRepository: Repository<BusinessUnit>;

  constructor(private datasource: DataSource) {
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      SearchEdaeUsersE2eSeed.countryId,
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      SearchEdaeUsersE2eSeed.businessUnitId,
      SearchEdaeUsersE2eSeed.businessUnitName,
      SearchEdaeUsersE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      SearchEdaeUsersE2eSeed.superAdminUserId,
      SearchEdaeUsersE2eSeed.superAdminUserEmail,
      SearchEdaeUsersE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      datasource,
      SearchEdaeUsersE2eSeed.adminUserId,
      SearchEdaeUsersE2eSeed.adminUserEmail,
      SearchEdaeUsersE2eSeed.adminUserPassword,
      [],
    );
    this.firstUser = EdaeUser.create(
      SearchEdaeUsersE2eSeed.firstEdaeUserId,
      SearchEdaeUsersE2eSeed.firstEdaeUserName,
      SearchEdaeUsersE2eSeed.firstEdaeUserSurname1,
      null,
      SearchEdaeUsersE2eSeed.firstEdaeuUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.GESTOR_FCT],
      [...this.superAdminUser.businessUnits],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      this.country,
      null,
    );
    await this.edaeUserRepository.save(this.firstUser);

    this.secondUser = EdaeUser.create(
      SearchEdaeUsersE2eSeed.secondEdaeUserId,
      SearchEdaeUsersE2eSeed.secondEdaeUserName,
      SearchEdaeUsersE2eSeed.secondEdaeUserSurname1,
      null,
      SearchEdaeUsersE2eSeed.secondEdaeuUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE],
      [...this.superAdminUser.businessUnits],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      this.country,
      null,
    );
    await this.edaeUserRepository.save(this.secondUser);
  }

  async clear(): Promise<void> {
    await this.edaeUserRepository.delete(this.firstUser.id);
    await this.edaeUserRepository.delete(this.secondUser.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
