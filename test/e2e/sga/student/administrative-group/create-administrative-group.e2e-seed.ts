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
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';

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
  public static periodBlockId = uuid();
  public static periodBlockName = 'Bloque 1';
  public static periodBlockStartDate = '2023-09-01';
  public static periodBlockEndDate = '2024-08-01';
  public static periodBlockId2 = uuid();
  public static periodBlockName2 = 'Bloque 2';
  public static periodBlockStartDate2 = '2024-09-01';
  public static periodBlockEndDate2 = '2025-08-01';

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
  private periodBlock: PeriodBlock;
  private secondPeriodBlock: PeriodBlock;
  private secondAcademicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private secondProgramBlock: ProgramBlock;
  private title: Title;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private periodBlockRepository: Repository<PeriodBlock>;
  private blockRelationRepository: Repository<BlockRelation>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private administrativeGroupRepository: Repository<AdministrativeGroup>;

  constructor(private readonly datasource: DataSource) {
    this.academicPeriodRepository =
      datasource.getRepository(academicPeriodSchema);
    this.academicProgramRepository = datasource.getRepository(
      academicProgramSchema,
    );
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.titleRepository = datasource.getRepository(titleSchema);
    this.programBlockRepository = datasource.getRepository(programBlockSchema);
    this.administrativeGroupRepository = datasource.getRepository(
      administrativeGroupSchema,
    );
    this.periodBlockRepository = datasource.getRepository(periodBlockSchema);
    this.blockRelationRepository =
      datasource.getRepository(blockRelationSchema);
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
      [AdminUserRoles.GESTOR_360],
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

    this.periodBlock = PeriodBlock.create(
      CreateAdministrativeGroupE2eSeed.periodBlockId,
      this.academicPeriod,
      CreateAdministrativeGroupE2eSeed.periodBlockName,
      new Date(CreateAdministrativeGroupE2eSeed.periodBlockStartDate),
      new Date(CreateAdministrativeGroupE2eSeed.periodBlockEndDate),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.periodBlock);

    this.secondPeriodBlock = PeriodBlock.create(
      CreateAdministrativeGroupE2eSeed.periodBlockId2,
      this.academicPeriod,
      CreateAdministrativeGroupE2eSeed.periodBlockName2,
      new Date(CreateAdministrativeGroupE2eSeed.periodBlockStartDate2),
      new Date(CreateAdministrativeGroupE2eSeed.periodBlockEndDate2),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.secondPeriodBlock);

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

    await this.blockRelationRepository.save(
      BlockRelation.create(
        uuid(),
        this.periodBlock,
        this.programBlock,
        this.superAdminUser,
      ),
    );

    await this.blockRelationRepository.save(
      BlockRelation.create(
        uuid(),
        this.secondPeriodBlock,
        this.secondProgramBlock,
        this.superAdminUser,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.administrativeGroupRepository.delete({});
    await this.blockRelationRepository.delete({});
    await this.periodBlockRepository.delete(this.periodBlock.id);
    await this.periodBlockRepository.delete(this.secondPeriodBlock.id);
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
