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
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

export class GetAllAcademicProgramsByAcademicPeriodE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private country: Country;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private title: Title;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;

  public static superAdminUserMail: string =
    'SuperAdminUserTestMail@universae.com';
  public static superAdminUserId: string =
    'd506b063-f57d-4e47-a91e-a83e06762741';
  public static superAdminUserPassword: string = 'test1234';

  public static countryId = '34bf728e-745a-4a0e-9235-80627fb225dc';

  public static businessUnitId: string = '5a97489a-c46d-4ea0-89e9-b382c1ab60ff';
  public static businessUnitName: string = 'Shanghai';
  public static businessUnitCode: string = 'SH01';

  public static titleId = '54b4f466-2902-4d65-affa-691f4ae66ec9';
  public static titleName = 'Title 1';
  public static titleOfficialCode = 'OC1';

  public static academicProgramId = '6db71d5f-61d2-4754-bc46-a4b46da54e27';
  public static academicProgramName = 'Academic Program 1';
  public static academicProgramCode = 'OC1';
  public static academicProgramStructureType: ProgramBlockStructureType =
    ProgramBlockStructureType.QUATRIMESTER;

  public static academicPeriodId = 'ca0f7d7b-0f07-4335-82dd-e08a76c405af';
  public static academicPeriodName = 'ENERO-2024';
  public static academicPeriodCode = 'EN24';
  public static academicPeriodStartDate = new Date(2022, 10, 12);
  public static academicPeriodEndDate = new Date(2023, 10, 12);

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly academicPeriodRepository: Repository<AcademicPeriod>;
  private readonly titleRepository: Repository<Title>;
  private readonly academicProgramRepository: Repository<AcademicProgram>;
  private readonly programBlockRepository: Repository<ProgramBlock>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.academicPeriodRepository =
      datasource.getRepository(academicPeriodSchema);
    this.titleRepository = datasource.getRepository(titleSchema);
    this.academicProgramRepository = datasource.getRepository(
      academicProgramSchema,
    );
    this.programBlockRepository = datasource.getRepository(programBlockSchema);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.countryId,
      'mercurio',
      'GGZ',
      'Mercurio',
      '988',
      ':D',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.businessUnitId,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.businessUnitName,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    const savedBusinessUnit = await this.businessUnitRepository.save(
      this.businessUnit,
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.superAdminUserId,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.superAdminUserMail,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = Title.create(
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.titleId,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.titleName,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.titleOfficialCode,
      'Official Title',
      'Official Program',
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicProgramId,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicProgramName,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicProgramStructureType,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.programBlock = ProgramBlock.create(
      'd506b063-f57d-4e47-a91e-a83e06762741',
      'Program Block 1',
      this.academicProgram,
      this.superAdminUser,
    );

    this.academicProgram.programBlocks.push(this.programBlock);
    await this.academicProgramRepository.save({
      id: this.academicProgram.id,
      name: this.academicProgram.name,
      code: this.academicProgram.code,
      title: this.academicProgram.title,
      businessUnit: this.academicProgram.businessUnit,
      createdAt: this.academicProgram.createdAt,
      createdBy: this.academicProgram.createdBy,
      updatedAt: this.academicProgram.updatedAt,
      updatedBy: this.academicProgram.updatedBy,
      structureType: this.academicProgram.structureType,
      programBlocks: this.academicProgram.programBlocks,
    });

    this.academicPeriod = AcademicPeriod.create(
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicPeriodId,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicPeriodName,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicPeriodCode,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicPeriodStartDate,
      GetAllAcademicProgramsByAcademicPeriodE2eSeed.academicPeriodEndDate,
      savedBusinessUnit,
      1,
      this.superAdminUser,
    );
    this.academicPeriod.addAcademicProgram(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);
  }

  async clear(): Promise<void> {
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
