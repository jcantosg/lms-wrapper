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
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';

export class CreateAcademicProgramE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-academic-program@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-academic-program@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static countryId = uuid();
  public static titleId = uuid();

  public static academicProgramId = 'ca0f7d7b-0f07-4335-82dd-e08a76c405af';
  public static secondAcademicProgramId =
    '37163ab1-f6ba-4fe7-8cfa-4d22dccc916a';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private country: Country;
  private title: Title;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicProgramRepository: Repository<AcademicProgram>;
  private readonly titleRepository: Repository<Title>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.titleRepository = datasource.getRepository(Title);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      CreateAcademicProgramE2eSeed.countryId,
      'TESGID',
      'TESTGETID',
      'testCountry',
      '+999',
      'emoji',
    );
    await this.countryRepository.save(this.country);
    this.businessUnit = BusinessUnit.create(
      CreateAcademicProgramE2eSeed.businessUnitId,
      'business unit name',
      'business unit code',
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateAcademicProgramE2eSeed.adminUserId,
      CreateAcademicProgramE2eSeed.adminUserEmail,
      CreateAcademicProgramE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateAcademicProgramE2eSeed.superAdminUserId,
      CreateAcademicProgramE2eSeed.superAdminUserEmail,
      CreateAcademicProgramE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = await this.titleRepository.save(
      Title.create(
        CreateAcademicProgramE2eSeed.titleId,
        'name',
        'code',
        'title',
        'program',
        this.businessUnit,
        this.superAdminUser,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.academicProgramRepository.delete(
      CreateAcademicProgramE2eSeed.academicProgramId,
    );
    await this.titleRepository.delete(CreateAcademicProgramE2eSeed.titleId);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
