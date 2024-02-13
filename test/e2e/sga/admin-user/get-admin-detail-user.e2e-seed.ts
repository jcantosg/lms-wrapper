import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';

export class GetAdminDetailUserE2eSeed implements E2eSeed {
  public static newAdminId = '83670209-9598-41d5-9c57-a393493f1b98';
  public static newAdminEmail = 'getadmindetail@universae.com';
  public static newAdminPassword = 'pass123';
  public static newAdminName = 'getadmindetail';
  public static newAdminSurname = 'surname';
  public static newAdminRoles = [AdminUserRoles.JEFATURA];
  public static newIdentityDocument = getAnIdentityDocument().value;

  public static id = '91a46e8d-b032-488a-8ba3-322de1b20dc6';
  public static email = 'superadmin@email.com';
  public static password = 'pass123';
  public static role = AdminUserRoles.SUPERADMIN;

  public static newAdminBusinessUnits = [
    'd9c27778-3361-4d32-a81a-159a41df2924',
  ];

  private superAdminUser: AdminUser;
  private newAdminUser: AdminUser;

  private businessUnit: BusinessUnit;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = this.datasource.getRepository(BusinessUnit);
    this.userRepository = this.datasource.getRepository(AdminUser);
    this.countryRepository = this.datasource.getRepository(Country);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAdminDetailUserE2eSeed.id,
      GetAdminDetailUserE2eSeed.email,
      GetAdminDetailUserE2eSeed.password,
      [GetAdminDetailUserE2eSeed.role],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = BusinessUnit.create(
      GetAdminDetailUserE2eSeed.newAdminBusinessUnits[0],
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

    this.newAdminUser = await createAdminUser(
      this.datasource,
      GetAdminDetailUserE2eSeed.newAdminId,
      GetAdminDetailUserE2eSeed.newAdminEmail,
      GetAdminDetailUserE2eSeed.newAdminPassword,
      GetAdminDetailUserE2eSeed.newAdminRoles,
      [this.businessUnit],
    );
  }

  async clear() {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.newAdminUser.id);
    await this.userRepository.delete(this.superAdminUser.id);
  }
}
