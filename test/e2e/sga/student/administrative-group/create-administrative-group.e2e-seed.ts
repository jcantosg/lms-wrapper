import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';

export class CreateAdministrativeGroupE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2025';
  public static academicPeriodCode = 'M-23-25';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 2;

  public static academicPeriodId2 = uuid();
  public static academicPeriodName2 = 'Madrid 2024 2026';
  public static academicPeriodCode2 = 'B-24-26';
  public static academicPeriodStartDate2 = '2024-09-01';
  public static academicPeriodEndDate2 = '2026-09-01';
  public static academicPeriodBlocksNumber2 = 2;

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static businessUnitId2 = uuid();
  public static businessUnitName2 = 'Barcelona';
  public static businessUnitCode2 = 'BAR';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';

  public static programBlockId2 = uuid();
  public static programBlockName2 = 'Bloque 2';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private secondAcademicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private secondProgramBlock: ProgramBlock;
  private title: Title;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private administrativeGroupRepository: Repository<AdministrativeGroup>;

  constructor(private readonly datasource: DataSource) {
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.titleRepository = datasource.getRepository(Title);
    this.programBlockRepository = datasource.getRepository(ProgramBlock);
    this.administrativeGroupRepository =
      datasource.getRepository(AdministrativeGroup);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      CreateAdministrativeGroupE2eSeed.businessUnitId,
      CreateAdministrativeGroupE2eSeed.businessUnitName,
      CreateAdministrativeGroupE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      CreateAdministrativeGroupE2eSeed.businessUnitId2,
      CreateAdministrativeGroupE2eSeed.businessUnitName2,
      CreateAdministrativeGroupE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateAdministrativeGroupE2eSeed.superAdminUserId,
      CreateAdministrativeGroupE2eSeed.superAdminUserEmail,
      CreateAdministrativeGroupE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateAdministrativeGroupE2eSeed.adminUserId,
      CreateAdministrativeGroupE2eSeed.adminUserEmail,
      CreateAdministrativeGroupE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    this.title = Title.create(
      uuid(),
      'title',
      'officialCode',
      'officialTitle',
      'officialProgram',
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      CreateAdministrativeGroupE2eSeed.academicProgramId,
      CreateAdministrativeGroupE2eSeed.academicProgramName,
      CreateAdministrativeGroupE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      CreateAdministrativeGroupE2eSeed.academicPeriodId,
      CreateAdministrativeGroupE2eSeed.academicPeriodName,
      CreateAdministrativeGroupE2eSeed.academicPeriodCode,
      new Date(CreateAdministrativeGroupE2eSeed.academicPeriodStartDate),
      new Date(CreateAdministrativeGroupE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      CreateAdministrativeGroupE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.secondAcademicPeriod = AcademicPeriod.create(
      CreateAdministrativeGroupE2eSeed.academicPeriodId2,
      CreateAdministrativeGroupE2eSeed.academicPeriodName2,
      CreateAdministrativeGroupE2eSeed.academicPeriodCode2,
      new Date(CreateAdministrativeGroupE2eSeed.academicPeriodStartDate2),
      new Date(CreateAdministrativeGroupE2eSeed.academicPeriodEndDate2),
      this.businessUnit,
      CreateAdministrativeGroupE2eSeed.academicPeriodBlocksNumber2,
      this.superAdminUser,
    );
    await this.academicPeriodRepository.save(this.secondAcademicPeriod);

    this.programBlock = ProgramBlock.create(
      CreateAdministrativeGroupE2eSeed.programBlockId,
      CreateAdministrativeGroupE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);

    this.secondProgramBlock = ProgramBlock.create(
      CreateAdministrativeGroupE2eSeed.programBlockId2,
      CreateAdministrativeGroupE2eSeed.programBlockName2,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.secondProgramBlock);

    this.academicProgram.programBlocks = [
      this.programBlock,
      this.secondProgramBlock,
    ];
  }

  async clear(): Promise<void> {
    await this.administrativeGroupRepository.delete({});
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.programBlockRepository.delete(this.secondProgramBlock.id);
    await this.academicPeriodRepository.delete(this.secondAcademicPeriod.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
