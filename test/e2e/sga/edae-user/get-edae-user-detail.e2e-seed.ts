import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class GetEdaeUserDetailE2eSeed implements E2eSeed {
  public static edaeUserId = '83670209-9598-41d5-9c57-a393493f1b98';
  public static edaeUserEmail = 'getedaedetail@universae.com';
  public static edaeUserRoles = [EdaeRoles.COORDINADOR_FCT];
  public static edaeUserIdentityDocument = getAnIdentityDocument();
  public static edaeUserName = 'name';
  public static edaeUserSurname1 = 'surname1';
  public static edaeUserSurname2 = 'surname2';
  public static edaeUserTimezone = TimeZoneEnum.GMT_MINUS_1;
  public static edaeUserIsRemote = true;

  public static superAdminId = '91a46e8d-b032-488a-8ba3-322de1b20dc6';
  public static superAdminEmail = 'superadmin@email.com';
  public static superAdminPassword = 'pass123';
  public static superAdminRole = AdminUserRoles.SUPERADMIN;

  public static adminId = 'dadefe9a-dc44-400c-afcf-add312b52311';
  public static adminEmail = 'admin@email.com';
  public static adminPassword = 'pass123';
  public static adminRole = AdminUserRoles.GESTOR_360;

  public static adminBusinessUnits = ['d9c27778-3361-4d32-a81a-159a41df2924'];

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private businessUnit: BusinessUnit;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;
  private edaeUserRepository: Repository<EdaeUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = this.datasource.getRepository(BusinessUnit);
    this.userRepository = this.datasource.getRepository(AdminUser);
    this.countryRepository = this.datasource.getRepository(Country);
    this.edaeUserRepository = this.datasource.getRepository(EdaeUser);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetEdaeUserDetailE2eSeed.adminId,
      GetEdaeUserDetailE2eSeed.adminEmail,
      GetEdaeUserDetailE2eSeed.adminPassword,
      [GetEdaeUserDetailE2eSeed.adminRole],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetEdaeUserDetailE2eSeed.superAdminId,
      GetEdaeUserDetailE2eSeed.superAdminEmail,
      GetEdaeUserDetailE2eSeed.superAdminPassword,
      [GetEdaeUserDetailE2eSeed.superAdminRole],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = BusinessUnit.create(
      GetEdaeUserDetailE2eSeed.adminBusinessUnits[0],
      'Madrid',
      'MAD',
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser.addBusinessUnit(this.businessUnit);
    await this.userRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.edaeUserRepository.save(
      EdaeUser.create(
        GetEdaeUserDetailE2eSeed.edaeUserId,
        GetEdaeUserDetailE2eSeed.edaeUserName,
        GetEdaeUserDetailE2eSeed.edaeUserSurname1,
        GetEdaeUserDetailE2eSeed.edaeUserSurname2,
        GetEdaeUserDetailE2eSeed.edaeUserEmail,
        GetEdaeUserDetailE2eSeed.edaeUserIdentityDocument,
        GetEdaeUserDetailE2eSeed.edaeUserRoles,
        [this.businessUnit],
        GetEdaeUserDetailE2eSeed.edaeUserTimezone,
        GetEdaeUserDetailE2eSeed.edaeUserIsRemote,
        country,
        '',
      ),
    );
  }

  async clear() {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.adminUser.id);
    await this.userRepository.delete(this.superAdminUser.id);
    await this.edaeUserRepository.delete(GetEdaeUserDetailE2eSeed.edaeUserId);
  }
}
