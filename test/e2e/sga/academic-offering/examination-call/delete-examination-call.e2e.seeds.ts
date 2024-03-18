import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class DeleteExaminationCallE2eSeed implements E2eSeed {
  public static examinationCallId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static examinationCallName = 'Nombre original';
  public static examinationCallStartDate = new Date('2020-10-10');
  public static examinationCallEndDate = new Date('2020-10-11');

  public static superAdminUserEmail = 'super-delete-examination-call@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'delete-examination-call@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  private examinationCall: ExaminationCall;
  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private academicPeriod: AcademicPeriod;

  private examinationCallRepository: Repository<ExaminationCall>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private academicPeriodRepository: Repository<AcademicPeriod>;
  private countryRepository: Repository<Country>;

  constructor(private readonly datasource: DataSource) {
    this.examinationCallRepository = datasource.getRepository(ExaminationCall);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.countryRepository = datasource.getRepository(Country);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneOrFail({
      where: { name: 'España' },
    });
    this.businessUnit = BusinessUnit.create(
      DeleteExaminationCallE2eSeed.businessUnitId,
      DeleteExaminationCallE2eSeed.businessUnitName,
      DeleteExaminationCallE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      DeleteExaminationCallE2eSeed.superAdminUserId,
      DeleteExaminationCallE2eSeed.superAdminUserEmail,
      DeleteExaminationCallE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      DeleteExaminationCallE2eSeed.adminUserId,
      DeleteExaminationCallE2eSeed.adminUserEmail,
      DeleteExaminationCallE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );
    this.academicPeriod = AcademicPeriod.create(
      uuid(),
      'test',
      'code',
      new Date(2024, 10, 2),
      new Date(2025, 5, 5),
      this.businessUnit,
      3,
      this.superAdminUser,
    );
    await this.academicPeriodRepository.save(this.academicPeriod);
    this.examinationCall = ExaminationCall.create(
      DeleteExaminationCallE2eSeed.examinationCallId,
      DeleteExaminationCallE2eSeed.examinationCallName,
      DeleteExaminationCallE2eSeed.examinationCallStartDate,
      DeleteExaminationCallE2eSeed.examinationCallEndDate,
      TimeZoneEnum.GMT_PLUS_1,
      this.academicPeriod,
    );
    await this.examinationCallRepository.save(this.examinationCall);
  }

  async clear(): Promise<void> {
    await this.examinationCallRepository.delete(this.examinationCall.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
