import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

export class GetAllAcademicProgramsE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-academic-program@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static titleId = '10516686-357c-4c5d-8d09-34a29f8d8121';
  public static titleName = 'Aplicaciones Web';
  public static titleOfficialTitle = 'DOR 12';
  public static titleOfficialProgram = 'Real Decreto 10/23';

  public static firstAcademicProgramId = '7158c476-b422-4f3d-817e-17290db6e76a';
  public static firstAcademicProgramName = 'Desarrollo Web';
  public static firstAcademicProgramCode = 'DAW';

  public static secondAcademicProgramId =
    '673d438d-bc8c-41eb-ab60-1c867266ae64';
  public static secondAcademicProgramName = 'Aplicaciones Móviles';
  public static secondAcademicProgramCode = 'APP';

  private superAdmin: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;

  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private titleRepository: Repository<Title>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.titleRepository = datasource.getRepository(Title);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });
    this.superAdmin = await createAdminUser(
      this.datasource,
      GetAllAcademicProgramsE2eSeed.superAdminUserId,
      GetAllAcademicProgramsE2eSeed.superAdminUserEmail,
      GetAllAcademicProgramsE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.businessUnit = BusinessUnit.create(
      GetAllAcademicProgramsE2eSeed.businessUnitId,
      GetAllAcademicProgramsE2eSeed.businessUnitName,
      GetAllAcademicProgramsE2eSeed.businessUnitCode,
      country,
      this.superAdmin,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.title = Title.create(
      GetAllAcademicProgramsE2eSeed.titleId,
      GetAllAcademicProgramsE2eSeed.titleName,
      null,
      GetAllAcademicProgramsE2eSeed.titleOfficialTitle,
      GetAllAcademicProgramsE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdmin,
    );
    await this.titleRepository.save(this.title);

    await this.academicProgramRepository.save(
      AcademicProgram.create(
        GetAllAcademicProgramsE2eSeed.firstAcademicProgramId,
        GetAllAcademicProgramsE2eSeed.firstAcademicProgramName,
        GetAllAcademicProgramsE2eSeed.firstAcademicProgramCode,
        this.title,
        this.businessUnit,
        this.superAdmin,
        ProgramBlockStructureType.CUSTOM,
      ),
    );
    await this.academicProgramRepository.save(
      AcademicProgram.create(
        GetAllAcademicProgramsE2eSeed.secondAcademicProgramId,
        GetAllAcademicProgramsE2eSeed.secondAcademicProgramName,
        GetAllAcademicProgramsE2eSeed.secondAcademicProgramCode,
        this.title,
        this.businessUnit,
        this.superAdmin,
        ProgramBlockStructureType.CUSTOM,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.academicProgramRepository.delete(
      GetAllAcademicProgramsE2eSeed.firstAcademicProgramId,
    );
    await this.academicProgramRepository.delete(
      GetAllAcademicProgramsE2eSeed.secondAcademicProgramId,
    );
    await this.titleRepository.delete(GetAllAcademicProgramsE2eSeed.titleId);
    await this.businessUnitRepository.delete(
      GetAllAcademicProgramsE2eSeed.businessUnitId,
    );
    await removeAdminUser(this.datasource, this.superAdmin);
  }
}
