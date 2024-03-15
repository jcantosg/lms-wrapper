import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class EditExaminationCallE2eSeed implements E2eSeed {
  public static examinationCallId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static examinationCallName = 'Nombre original';
  public static examinationCallStartDate = new Date('2020-10-10');
  public static examinationCallEndDate = new Date('2020-10-11');

  public static examinationCallNewName = 'Nombre editado';
  public static examinationCallNewStartDate = new Date('2024-10-10');
  public static examinationCallNewEndDate = new Date('2024-10-20');

  public static superAdminUserEmail = 'super-edit-examination-call@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'edit-examination-call@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  private examinationCall: ExaminationCall;
  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private country: Country;
  private academicPeriod: AcademicPeriod;

  private examinationCallRepository: Repository<ExaminationCall>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private adminUserRepository: Repository<AdminUser>;
  private academicPeriodRepository: Repository<AcademicPeriod>;

  constructor(private datasource: DataSource) {
    this.examinationCallRepository = datasource.getRepository(ExaminationCall);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.adminUserRepository = datasource.getRepository(AdminUser);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      EditExaminationCallE2eSeed.adminUserId,
      EditExaminationCallE2eSeed.adminUserEmail,
      EditExaminationCallE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditExaminationCallE2eSeed.superAdminUserId,
      EditExaminationCallE2eSeed.superAdminUserEmail,
      EditExaminationCallE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      uuid(),
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        EditExaminationCallE2eSeed.businessUnitId,
        EditExaminationCallE2eSeed.businessUnitName,
        EditExaminationCallE2eSeed.businessUnitCode,
        this.country,
        this.superAdminUser,
      ),
    );
    this.superAdminUser.addBusinessUnit(this.businessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.academicPeriod = await this.academicPeriodRepository.save(
      AcademicPeriod.create(
        uuid(),
        'name',
        'code',
        new Date(),
        new Date(),
        this.businessUnit,
        1,
        this.superAdminUser,
      ),
    );

    this.examinationCall = await this.examinationCallRepository.save(
      ExaminationCall.create(
        EditExaminationCallE2eSeed.examinationCallId,
        EditExaminationCallE2eSeed.examinationCallName,
        EditExaminationCallE2eSeed.examinationCallStartDate,
        EditExaminationCallE2eSeed.examinationCallEndDate,
        TimeZoneEnum.GMT,
        this.academicPeriod,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.examinationCallRepository.delete(this.examinationCall.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
