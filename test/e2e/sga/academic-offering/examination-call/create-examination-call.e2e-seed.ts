import { DataSource, Repository } from 'typeorm';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';

export class CreateExaminationCallE2eSeed implements E2eSeed {
  private academicPeriod: AcademicPeriod;
  private static academicPeriodId: string =
    '996bf3f3-a8ea-411e-b3c1-dc5ab0273c91';
  private static academicPeriodName: string = 'Examen final de ciencias';
  private static academicPeriodCode: string = '2024-1';
  private static academicPeriodStartDate: Date = new Date(2024, 4, 13);
  private static academicPeriodEndDate: Date = new Date(2024, 5, 2);
  private static academicPeriodBlocksNumber: number = 2;
  private static academicPeriodUser: AdminUser;

  public static examinationCallId: string =
    'e437e920-90cd-4d10-a906-0ef522438037';
  public static examinationCallname: string = 'examen fisica';
  public static examinationCallstartDate: Date = new Date(2024, 4, 13);
  public static examinationCallEndDate: Date = new Date(2024, 5, 2);
  public static examinationCallTimeZone: TimeZoneEnum = TimeZoneEnum.GMT_PLUS_1;
  public static examinationCallAcademicPeriodId: string = this.academicPeriodId;

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

  private country: Country;
  public static countryId = '34bf728e-745a-4a0e-9235-80627fb225dc';

  private businessUnit: BusinessUnit;
  public static businessUnitId = '5a97489a-c46d-4ea0-89e9-b382c1ab60ff';
  public static businessUnitName = 'Shangai';
  public static businessUnitCode = 'SH01';

  private countryRepository: Repository<Country>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private academicPeriodRepository: Repository<AcademicPeriod>;
  private examinationCallRepository: Repository<ExaminationCall>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.examinationCallRepository = datasource.getRepository(ExaminationCall);
  }

  async arrange() {
    this.country = Country.create(
      CreateExaminationCallE2eSeed.countryId,
      'venus',
      'ZvZ',
      'Marte',
      '989',
      ':)',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      CreateExaminationCallE2eSeed.businessUnitId,
      CreateExaminationCallE2eSeed.businessUnitName,
      CreateExaminationCallE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateExaminationCallE2eSeed.superAdminUserId,
      CreateExaminationCallE2eSeed.superAdminUserMail,
      CreateExaminationCallE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateExaminationCallE2eSeed.adminUserId,
      CreateExaminationCallE2eSeed.adminUserMail,
      CreateExaminationCallE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
    );

    this.academicPeriod = AcademicPeriod.create(
      CreateExaminationCallE2eSeed.academicPeriodId,
      CreateExaminationCallE2eSeed.academicPeriodName,
      CreateExaminationCallE2eSeed.academicPeriodCode,
      CreateExaminationCallE2eSeed.academicPeriodStartDate,
      CreateExaminationCallE2eSeed.academicPeriodEndDate,
      this.businessUnit,
      CreateExaminationCallE2eSeed.academicPeriodBlocksNumber,
      CreateExaminationCallE2eSeed.academicPeriodUser,
    );
    await this.academicPeriodRepository.save(this.academicPeriod);
  }

  async clear() {
    await this.examinationCallRepository.delete(
      CreateExaminationCallE2eSeed.examinationCallId,
    );
    await this.academicPeriodRepository.delete(
      CreateExaminationCallE2eSeed.academicPeriodId,
    );
    await this.businessUnitRepository.delete(
      CreateExaminationCallE2eSeed.businessUnitId,
    );
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(CreateExaminationCallE2eSeed.countryId);
  }
}
