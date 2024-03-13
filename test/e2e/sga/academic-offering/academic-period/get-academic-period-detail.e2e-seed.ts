import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export class GetAcademicPeriodDetailE2eSeed implements E2eSeed {
  public static academicPeriodId = '83670209-9598-41d5-9c57-a393493f1b98';
  public static academicPeriodName = 'name';
  public static academicPeriodCode = 'code';
  public static academicPeriodStartDate = new Date();
  public static academicPeriodEndDate = new Date();
  public static businessUnitId = '280d37c1-6712-4e05-8567-351db420ed30';
  public static businessUnitName = 'businessUnit name';

  public static superAdminId = '91a46e8d-b032-488a-8ba3-322de1b20dc6';
  public static superAdminEmail = 'superadmin@email.com';
  public static superAdminPassword = 'pass123';
  public static superAdminRole = AdminUserRoles.SUPERADMIN;

  public static adminId = 'dadefe9a-dc44-400c-afcf-add312b52311';
  public static adminEmail = 'admin@email.com';
  public static adminPassword = 'pass123';
  public static adminRole = AdminUserRoles.SECRETARIA;

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;
  private academicPeriodRepository: Repository<AcademicPeriod>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = this.datasource.getRepository(BusinessUnit);
    this.userRepository = this.datasource.getRepository(AdminUser);
    this.countryRepository = this.datasource.getRepository(Country);
    this.academicPeriodRepository =
      this.datasource.getRepository(AcademicPeriod);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetAcademicPeriodDetailE2eSeed.adminId,
      GetAcademicPeriodDetailE2eSeed.adminEmail,
      GetAcademicPeriodDetailE2eSeed.adminPassword,
      [GetAcademicPeriodDetailE2eSeed.adminRole],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAcademicPeriodDetailE2eSeed.superAdminId,
      GetAcademicPeriodDetailE2eSeed.superAdminEmail,
      GetAcademicPeriodDetailE2eSeed.superAdminPassword,
      [GetAcademicPeriodDetailE2eSeed.superAdminRole],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        GetAcademicPeriodDetailE2eSeed.businessUnitId,
        GetAcademicPeriodDetailE2eSeed.businessUnitName,
        'MAD',
        country,
        this.superAdminUser,
      ),
    );
    this.superAdminUser.addBusinessUnit(this.businessUnit);
    await this.userRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.academicPeriodRepository.save(
      AcademicPeriod.create(
        GetAcademicPeriodDetailE2eSeed.academicPeriodId,
        GetAcademicPeriodDetailE2eSeed.academicPeriodName,
        GetAcademicPeriodDetailE2eSeed.academicPeriodCode,
        GetAcademicPeriodDetailE2eSeed.academicPeriodStartDate,
        GetAcademicPeriodDetailE2eSeed.academicPeriodEndDate,
        this.businessUnit,
        1,
        this.superAdminUser,
      ),
    );
  }

  async clear() {
    await this.academicPeriodRepository.delete(
      GetAcademicPeriodDetailE2eSeed.academicPeriodId,
    );
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.adminUser.id);
    await this.userRepository.delete(this.superAdminUser.id);
  }
}
