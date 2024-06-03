import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';

export class GetAcademicProgramDetailE2eSeed implements E2eSeed {
  public static academicProgramId = '83670209-9598-41d5-9c57-a393493f1b98';
  public static academicProgramName = 'name';
  public static academicProgramCode = 'code';

  public static titleId = '83670209-9598-41d5-9c57-a393493f1b99';
  public static titleName = 'title name';
  public static titleOfficialCode = 'officialCode';

  public static superAdminId = '91a46e8d-b032-488a-8ba3-322de1b20dc6';
  public static superAdminEmail = 'superadmin@email.com';
  public static superAdminPassword = 'pass123';
  public static superAdminRole = AdminUserRoles.SUPERADMIN;

  public static businessUnitId = 'd9c27778-3361-4d32-a81a-159a41df2924';
  public static businessUnitName = 'name';

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private academicProgramRepository: Repository<AcademicProgram>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository =
      this.datasource.getRepository(businessUnitSchema);
    this.userRepository = this.datasource.getRepository(adminUserSchema);
    this.countryRepository = this.datasource.getRepository(CountrySchema);
    this.titleRepository = this.datasource.getRepository(titleSchema);
    this.academicProgramRepository = this.datasource.getRepository(
      academicProgramSchema,
    );
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAcademicProgramDetailE2eSeed.superAdminId,
      GetAcademicProgramDetailE2eSeed.superAdminEmail,
      GetAcademicProgramDetailE2eSeed.superAdminPassword,
      [GetAcademicProgramDetailE2eSeed.superAdminRole],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = BusinessUnit.create(
      GetAcademicProgramDetailE2eSeed.businessUnitId,
      GetAcademicProgramDetailE2eSeed.businessUnitName,
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

    this.title = await this.titleRepository.save(
      Title.create(
        GetAcademicProgramDetailE2eSeed.titleId,
        GetAcademicProgramDetailE2eSeed.titleName,
        GetAcademicProgramDetailE2eSeed.titleOfficialCode,
        'official title',
        'official program',
        this.businessUnit,
        this.superAdminUser,
      ),
    );

    await this.academicProgramRepository.save(
      AcademicProgram.create(
        GetAcademicProgramDetailE2eSeed.academicProgramId,
        GetAcademicProgramDetailE2eSeed.academicProgramName,
        GetAcademicProgramDetailE2eSeed.academicProgramCode,
        this.title,
        this.businessUnit,
        this.superAdminUser,
        ProgramBlockStructureType.CUSTOM,
      ),
    );
  }

  async clear() {
    await this.academicProgramRepository.delete(
      GetAcademicProgramDetailE2eSeed.academicProgramId,
    );
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.superAdminUser.id);
  }
}
