import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

export class EditEdaeUserE2eSeed implements E2eSeed {
  public static superAdminId = 'dee96fbe-f7ac-4284-ab86-4716d7a7a193';
  public static superAdminName = 'EditEdaeSuperAdmin';
  public static superAdminEmail = 'super-edit-edae-user@universae.com';
  public static superAdminPassword = 'test123';

  public static adminId = '7a2fc0ba-c4a5-462b-8442-f8e2e6ad5711';
  public static adminName = 'EditEdaeAdmin';
  public static adminEmail = 'edit-edae-user@universae.com';
  public static adminPassword = 'test123';

  public static businessUnitId = '8a7644cf-f8b6-445d-8a5d-c6ed22ee808e';
  public static businessUnitName = 'BusinessUnit';
  public static businessUnitCode = 'BUEU';

  public static edaeUserId = '9f344508-cec9-4472-aa35-531a4d76343d';
  public static edaeUserName = 'EditEdaeUser';
  public static edaeUserSurname = 'SurnameEdit';
  public static edaeUserEmail = 'edae-user@universae.com';

  public static newEdaeUserName = 'NewName';

  public static countryId = '5bb5ecb3-2ddb-45db-9622-e54884fa00fb';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private country: Country;
  private edaeUser: EdaeUser;

  private edaeUserRepository: Repository<EdaeUser>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      EditEdaeUserE2eSeed.countryId,
      'marte',
      'ZZZ',
      'Marte',
      '987',
      ':)',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      EditEdaeUserE2eSeed.businessUnitId,
      EditEdaeUserE2eSeed.businessUnitName,
      EditEdaeUserE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditEdaeUserE2eSeed.superAdminId,
      EditEdaeUserE2eSeed.superAdminEmail,
      EditEdaeUserE2eSeed.superAdminPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      EditEdaeUserE2eSeed.adminId,
      EditEdaeUserE2eSeed.adminEmail,
      EditEdaeUserE2eSeed.adminPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    this.edaeUser = EdaeUser.create(
      EditEdaeUserE2eSeed.edaeUserId,
      EditEdaeUserE2eSeed.name,
      EditEdaeUserE2eSeed.edaeUserSurname,
      null,
      EditEdaeUserE2eSeed.edaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.COORDINADOR_FCT],
      [this.businessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      this.country,
      null,
      'password',
    );

    await this.edaeUserRepository.save(this.edaeUser);
  }

  async clear(): Promise<void> {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.countryRepository.delete(this.country.id);
  }
}
