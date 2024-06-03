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
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { getAnEdaeUser } from '#test/entity-factory';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

export class RemoveEdaeUserFromAdministrativeGroupE2eSeed implements E2eSeed {
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

  public static edaeUserId = uuid();

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
  private edaeUser: EdaeUser;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private periodBlockRepository: Repository<PeriodBlock>;
  private blockRelationRepository: Repository<BlockRelation>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private administrativeGroupRepository: Repository<AdministrativeGroup>;
  private edaeUserRepository: Repository<EdaeUser>;

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
    this.administrativeGroupRepository = datasource.getRepository(
      administrativeGroupSchema,
    );
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
  }

  async arrange() {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.businessUnitId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.businessUnitName,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.superAdminUserId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.superAdminUserEmail,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.adminUserId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.adminUserEmail,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.adminUserPassword,
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
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicProgramId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicProgramName,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicPeriodId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicPeriodName,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicPeriodCode,
      new Date(
        RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicPeriodStartDate,
      ),
      new Date(
        RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicPeriodEndDate,
      ),
      this.businessUnit,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.periodBlock = PeriodBlock.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockId,
      this.academicPeriod,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockName,
      new Date(
        RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockStartDate,
      ),
      new Date(RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockEndDate),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.periodBlock);

    this.secondPeriodBlock = PeriodBlock.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockId2,
      this.academicPeriod,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockName2,
      new Date(
        RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockStartDate2,
      ),
      new Date(
        RemoveEdaeUserFromAdministrativeGroupE2eSeed.periodBlockEndDate2,
      ),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.secondPeriodBlock);

    this.programBlock = ProgramBlock.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.programBlockId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);

    this.secondProgramBlock = ProgramBlock.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.programBlockId2,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.programBlockName2,
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

    this.edaeUser = getAnEdaeUser(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.edaeUserId,
    );
    this.edaeUser.addBusinessUnit(this.businessUnit);
    this.edaeUser.location = country;
    await this.edaeUserRepository.save(this.edaeUser);

    this.administrativeGroup = AdministrativeGroup.create(
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.administrativeGroupId,
      RemoveEdaeUserFromAdministrativeGroupE2eSeed.administrativeGroupCode,
      this.businessUnit,
      this.academicPeriod,
      this.academicProgram,
      this.programBlock,
      this.periodBlock,
      this.superAdminUser,
    );
    this.administrativeGroup.addTeacher(this.edaeUser);
    await this.administrativeGroupRepository.save(this.administrativeGroup);
  }

  async clear() {
    await this.edaeUserRepository.delete(this.edaeUser.id);
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
