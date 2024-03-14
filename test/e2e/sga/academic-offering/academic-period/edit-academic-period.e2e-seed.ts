import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export class EditAcademicPeriodE2eSeed implements E2eSeed {
  public static countryId = uuid();

  public static superAdminUserEmail = 'super-edit-academic-period@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'edit-academic-period@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '21c1fb84-ca89-4b20-a646-08dbf32cd06a';

  public static academicPeriodId = '7baf9fc5-8976-4780-aa07-c0dfb420e230';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicPeriodRepository: Repository<AcademicPeriod>;
  private readonly adminUserRepository: Repository<AdminUser>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.adminUserRepository = datasource.getRepository(AdminUser);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      EditAcademicPeriodE2eSeed.adminUserId,
      EditAcademicPeriodE2eSeed.adminUserEmail,
      EditAcademicPeriodE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditAcademicPeriodE2eSeed.superAdminUserId,
      EditAcademicPeriodE2eSeed.superAdminUserEmail,
      EditAcademicPeriodE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      EditAcademicPeriodE2eSeed.countryId,
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      EditAcademicPeriodE2eSeed.businessUnitId,
      'Sevilla',
      'SEV',
      this.country,
      this.superAdminUser,
    );
    const savedBusinessUnit = await this.businessUnitRepository.save(
      this.businessUnit,
    );
    this.superAdminUser.addBusinessUnit(savedBusinessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.academicPeriod = AcademicPeriod.create(
      EditAcademicPeriodE2eSeed.academicPeriodId,
      'Name',
      'Code',
      new Date('2024-01-01'),
      new Date('2025-01-01'),
      savedBusinessUnit,
      1,
      this.superAdminUser,
    );
    await this.academicPeriodRepository.save(this.academicPeriod);
  }

  async clear() {
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(EditAcademicPeriodE2eSeed.countryId);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
