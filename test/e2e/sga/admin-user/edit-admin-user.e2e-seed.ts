import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';

export class EditAdminUserE2eSeed implements E2eSeed {
  public static newAdminId = 'ad14075c-ba7d-44dd-8ee8-2e1c4974e7e2';
  public static newAdminEmail = 'editadminuser@universae.com';
  public static newAdminPassword = 'pass123';
  public static newAdminRoles = [AdminUserRoles.SUPERVISOR_JEFATURA];

  public static normalUserId = '51e5ab94-ea0d-43ea-b334-c542358f8395';
  public static normalUserEmail = 'jefatura@universae.com';
  public static normalUserPassword = 'pass123';
  public static normalUserRoles = [AdminUserRoles.JEFATURA];

  public static id = 'd671caa8-eccb-423e-aa1d-cf044fa3c1c7';
  public static email = 'superadmin@email.com';
  public static password = 'pass123';
  public static role = AdminUserRoles.SUPERADMIN;

  public static newAdminBusinessUnits = [
    '6b3e398c-86ef-4ccc-8c6f-bffe4fdd0037',
  ];

  private superAdminUser: AdminUser;
  private newAdminUser: AdminUser;
  private normalUser: AdminUser;

  private businessUnit: BusinessUnit;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository =
      this.datasource.getRepository(businessUnitSchema);
    this.userRepository = this.datasource.getRepository(adminUserSchema);
    this.countryRepository = this.datasource.getRepository(CountrySchema);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditAdminUserE2eSeed.id,
      EditAdminUserE2eSeed.email,
      EditAdminUserE2eSeed.password,
      [EditAdminUserE2eSeed.role],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = BusinessUnit.create(
      EditAdminUserE2eSeed.newAdminBusinessUnits[0],
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
      EditAdminUserE2eSeed.newAdminId,
      EditAdminUserE2eSeed.newAdminEmail,
      EditAdminUserE2eSeed.newAdminPassword,
      EditAdminUserE2eSeed.newAdminRoles,
      [this.businessUnit],
    );

    this.normalUser = await createAdminUser(
      this.datasource,
      EditAdminUserE2eSeed.normalUserId,
      EditAdminUserE2eSeed.normalUserEmail,
      EditAdminUserE2eSeed.normalUserPassword,
      EditAdminUserE2eSeed.normalUserRoles,
      [this.businessUnit],
    );
  }

  async clear() {
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.newAdminUser.id);
    await this.userRepository.delete(this.superAdminUser.id);
  }
}
