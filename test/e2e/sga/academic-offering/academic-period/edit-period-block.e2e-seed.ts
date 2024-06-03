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
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';

export class EditPeriodBlockE2eSeed implements E2eSeed {
  public static countryId = uuid();

  public static superAdminUserEmail = 'super-edit-academic-period@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'edit-academic-period@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '21c1fb84-ca89-4b20-a646-08dbf32cd06a';

  public static periodBlockId = '7baf9fc5-8976-4780-aa07-c0dfb420e230';
  public static anotherPeriodBlockId = '7baf9fc5-8976-4780-aa07-c0dfb420e231';
  public static academicPeriodId = '6fe5450c-4830-41cb-9e86-1c0ef1bdd5e5';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private periodBlock: PeriodBlock;
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicPeriodRepository: Repository<AcademicPeriod>;
  private readonly adminUserRepository: Repository<AdminUser>;
  private readonly periodBlockRepository: Repository<PeriodBlock>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.academicPeriodRepository =
      datasource.getRepository(academicPeriodSchema);
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
    this.periodBlockRepository = datasource.getRepository(periodBlockSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      EditPeriodBlockE2eSeed.adminUserId,
      EditPeriodBlockE2eSeed.adminUserEmail,
      EditPeriodBlockE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditPeriodBlockE2eSeed.superAdminUserId,
      EditPeriodBlockE2eSeed.superAdminUserEmail,
      EditPeriodBlockE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      EditPeriodBlockE2eSeed.countryId,
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      EditPeriodBlockE2eSeed.businessUnitId,
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
      EditPeriodBlockE2eSeed.academicPeriodId,
      'Name',
      'Code',
      new Date('2024-01-01'),
      new Date('2025-01-01'),
      savedBusinessUnit,
      1,
      this.superAdminUser,
    );
    await this.academicPeriodRepository.save(this.academicPeriod);

    await this.periodBlockRepository.save(
      PeriodBlock.create(
        EditPeriodBlockE2eSeed.anotherPeriodBlockId,
        this.academicPeriod,
        'name',
        this.academicPeriod.startDate,
        new Date('2024-06-30'),
        this.superAdminUser,
      ),
    );

    await this.periodBlockRepository.save(
      PeriodBlock.create(
        EditPeriodBlockE2eSeed.periodBlockId,
        this.academicPeriod,
        'name2',
        new Date('2024-06-30'),
        this.academicPeriod.endDate,
        this.superAdminUser,
      ),
    );
  }

  async clear() {
    await this.periodBlockRepository.delete({});
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(EditPeriodBlockE2eSeed.countryId);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
