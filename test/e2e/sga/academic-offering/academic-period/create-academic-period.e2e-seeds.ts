import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { DataSource, Repository } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class CreateAcademicPeriodE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-academic-period@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-academic-period@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static countryId = uuid();
  public static countryEmoji = '🏳️GetId';
  public static countryName = 'TestGetId';

  public static academicPeriodId = 'ca0f7d7b-0f07-4335-82dd-e08a76c405af';
  public static academicPeriodName = 'ENERO-2024';
  public static academicPeriodCode = 'EN24';
  public static academicPeriodStartDate = new Date(2022, 10, 12);
  public static academicPeriodEndDate = new Date(2023, 10, 12);
  public static secondAcademicPeriodId = '37163ab1-f6ba-4fe7-8cfa-4d22dccc916a';
  public static secondAcademicPeriodCode = 'FEB2024';
  public static thirdAcademicPeriodId = '6b52876d-c7e8-4b50-952b-441142e6dfa0';

  public static examinationCallId = '2adcb996-00c0-41bc-ab37-e1468843ce1e';
  public static examinationCallName = 'NAME';
  public static examinationCallStartDate = new Date(2022, 10, 12);
  public static examinationCallEndDate = new Date(2023, 10, 12);
  public static examinationCallTimeZone = TimeZoneEnum.GMT_PLUS_1;

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicPeriodRepository: Repository<AcademicPeriod>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      CreateAcademicPeriodE2eSeed.countryId,
      'TESGID',
      'TESTGETID',
      CreateAcademicPeriodE2eSeed.countryName,
      '+999',
      CreateAcademicPeriodE2eSeed.countryEmoji,
    );
    await this.countryRepository.save(this.country);
    this.businessUnit = BusinessUnit.create(
      CreateAcademicPeriodE2eSeed.businessUnitId,
      CreateAcademicPeriodE2eSeed.businessUnitName,
      CreateAcademicPeriodE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateAcademicPeriodE2eSeed.adminUserId,
      CreateAcademicPeriodE2eSeed.adminUserEmail,
      CreateAcademicPeriodE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateAcademicPeriodE2eSeed.superAdminUserId,
      CreateAcademicPeriodE2eSeed.superAdminUserEmail,
      CreateAcademicPeriodE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
  }

  async clear(): Promise<void> {
    await this.academicPeriodRepository.delete(
      CreateAcademicPeriodE2eSeed.academicPeriodId,
    );
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
