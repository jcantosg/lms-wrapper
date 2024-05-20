import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

export class GetAdministrativeGroupE2eSeed implements E2eSeed {
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
  public static periodBlockStartDate2 = '2024-10-01';
  public static periodBlockEndDate2 = '2025-08-01';

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';
  public static programBlockId2 = uuid();
  public static programBlockName2 = 'Bloque 2';

  public static administrativeGroupId = uuid();
  public static administrativeGroupCode = 'M-23-25_MAD-INAS_1';
  public static secondAdministrativeGroupId = uuid();
  public static secondAdministrativeGroupCode = 'M-23-25_MAD-INAS_2';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private periodBlock: PeriodBlock;
  private secondPeriodBlock: PeriodBlock;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private secondProgramBlock: ProgramBlock;
  private title: Title;
  private administrativeGroup: AdministrativeGroup;
  private secondAdministrativeGroup: AdministrativeGroup;

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
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.titleRepository = datasource.getRepository(Title);
    this.programBlockRepository = datasource.getRepository(ProgramBlock);
    this.administrativeGroupRepository =
      datasource.getRepository(AdministrativeGroup);
    this.periodBlockRepository = datasource.getRepository(PeriodBlock);
    this.blockRelationRepository = datasource.getRepository(BlockRelation);
    this.administrativeGroupRepository =
      datasource.getRepository(AdministrativeGroup);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      GetAdministrativeGroupE2eSeed.businessUnitId,
      GetAdministrativeGroupE2eSeed.businessUnitName,
      GetAdministrativeGroupE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAdministrativeGroupE2eSeed.superAdminUserId,
      GetAdministrativeGroupE2eSeed.superAdminUserEmail,
      GetAdministrativeGroupE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      GetAdministrativeGroupE2eSeed.adminUserId,
      GetAdministrativeGroupE2eSeed.adminUserEmail,
      GetAdministrativeGroupE2eSeed.adminUserPassword,
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
      GetAdministrativeGroupE2eSeed.academicProgramId,
      GetAdministrativeGroupE2eSeed.academicProgramName,
      GetAdministrativeGroupE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      GetAdministrativeGroupE2eSeed.academicPeriodId,
      GetAdministrativeGroupE2eSeed.academicPeriodName,
      GetAdministrativeGroupE2eSeed.academicPeriodCode,
      new Date(GetAdministrativeGroupE2eSeed.academicPeriodStartDate),
      new Date(GetAdministrativeGroupE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      GetAdministrativeGroupE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.periodBlock = PeriodBlock.create(
      GetAdministrativeGroupE2eSeed.periodBlockId,
      this.academicPeriod,
      GetAdministrativeGroupE2eSeed.periodBlockName,
      new Date(GetAdministrativeGroupE2eSeed.periodBlockStartDate),
      new Date(GetAdministrativeGroupE2eSeed.periodBlockEndDate),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.periodBlock);

    this.secondPeriodBlock = PeriodBlock.create(
      GetAdministrativeGroupE2eSeed.periodBlockId2,
      this.academicPeriod,
      GetAdministrativeGroupE2eSeed.periodBlockName2,
      new Date(GetAdministrativeGroupE2eSeed.periodBlockStartDate2),
      new Date(GetAdministrativeGroupE2eSeed.periodBlockEndDate2),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.secondPeriodBlock);

    this.programBlock = ProgramBlock.create(
      GetAdministrativeGroupE2eSeed.programBlockId,
      GetAdministrativeGroupE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);

    this.secondProgramBlock = ProgramBlock.create(
      GetAdministrativeGroupE2eSeed.programBlockId2,
      GetAdministrativeGroupE2eSeed.programBlockName2,
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

    this.administrativeGroup = AdministrativeGroup.create(
      GetAdministrativeGroupE2eSeed.administrativeGroupId,
      GetAdministrativeGroupE2eSeed.administrativeGroupCode,
      this.businessUnit,
      this.academicPeriod,
      this.academicProgram,
      this.programBlock,
      this.periodBlock,
      this.superAdminUser,
    );
    await this.administrativeGroupRepository.save(this.administrativeGroup);

    this.secondAdministrativeGroup = AdministrativeGroup.create(
      GetAdministrativeGroupE2eSeed.secondAdministrativeGroupId,
      GetAdministrativeGroupE2eSeed.secondAdministrativeGroupCode,
      this.businessUnit,
      this.academicPeriod,
      this.academicProgram,
      this.secondProgramBlock,
      this.secondPeriodBlock,
      this.superAdminUser,
    );
    await this.administrativeGroupRepository.save(
      this.secondAdministrativeGroup,
    );
  }

  async clear(): Promise<void> {
    await this.administrativeGroupRepository.delete({});
    await this.blockRelationRepository.delete({});
    await this.periodBlockRepository.delete(this.periodBlock.id);
    await this.periodBlockRepository.delete(this.secondPeriodBlock.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.programBlockRepository.delete(this.secondProgramBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
