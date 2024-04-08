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
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';

export class RemoveAcademicProgramFromAcademicPeriodE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-edit-academic-period@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'edit-academic-period@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static countryId = uuid();
  public static businessUnitId = '21c1fb84-ca89-4b20-a646-08dbf32cd06a';
  public static academicPeriodId = '7baf9fc5-8976-4780-aa07-c0dfb420e230';
  public static academicProgramId = '23987612-f738-41f3-b798-82114eeb15e2';
  public static titleId = uuid();

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private country: Country;
  private title: Title;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicProgramRepository: Repository<AcademicProgram>;
  private readonly academicPeriodRepository: Repository<AcademicPeriod>;
  private readonly adminUserRepository: Repository<AdminUser>;
  private readonly titleRepository: Repository<Title>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.adminUserRepository = datasource.getRepository(AdminUser);
    this.titleRepository = datasource.getRepository(Title);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.adminUserId,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.adminUserEmail,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.superAdminUserId,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.superAdminUserEmail,
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.countryId,
      'TEST',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.businessUnitId,
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

    this.title = await this.titleRepository.save(
      Title.create(
        RemoveAcademicProgramFromAcademicPeriodE2eSeed.titleId,
        'name',
        'code',
        'title',
        'program',
        this.businessUnit,
        this.superAdminUser,
      ),
    );

    this.academicProgram = await this.academicProgramRepository.save(
      AcademicProgram.create(
        RemoveAcademicProgramFromAcademicPeriodE2eSeed.academicProgramId,
        'name',
        'code',
        this.title,
        this.businessUnit,
        this.superAdminUser,
      ),
    );

    this.academicPeriod = AcademicPeriod.create(
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.academicPeriodId,
      'Name',
      'Code',
      new Date('2024-01-01'),
      new Date('2025-01-01'),
      savedBusinessUnit,
      1,
      this.superAdminUser,
    );

    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);
  }

  async clear() {
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(
      RemoveAcademicProgramFromAcademicPeriodE2eSeed.countryId,
    );
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
