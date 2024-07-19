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
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

export class AddInternalGroupToAcademicPeriodE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2025';
  public static academicPeriodCode = 'M-23-25';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 1;

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';

  public static periodBlockId = uuid();
  public static periodBlockName = 'Bloque 1';

  public static blockRelationId = uuid();

  public static subjectId = uuid();

  public static internalGroupId = uuid();

  public static edaeUserId = uuid();

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private title: Title;
  private programBlock: ProgramBlock;
  private periodBlock: PeriodBlock;
  private subject: Subject;
  private edaeUser: EdaeUser;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private periodBlockRepository: Repository<PeriodBlock>;
  private internalGroupRepository: Repository<InternalGroup>;
  private blockRelationRepository: Repository<BlockRelation>;
  private subjectRepository: Repository<Subject>;
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
    this.periodBlockRepository = datasource.getRepository(periodBlockSchema);
    this.internalGroupRepository =
      datasource.getRepository(internalGroupSchema);
    this.blockRelationRepository =
      datasource.getRepository(blockRelationSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      AddInternalGroupToAcademicPeriodE2eSeed.businessUnitId,
      AddInternalGroupToAcademicPeriodE2eSeed.businessUnitName,
      AddInternalGroupToAcademicPeriodE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserId,
      AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserEmail,
      AddInternalGroupToAcademicPeriodE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      AddInternalGroupToAcademicPeriodE2eSeed.adminUserId,
      AddInternalGroupToAcademicPeriodE2eSeed.adminUserEmail,
      AddInternalGroupToAcademicPeriodE2eSeed.adminUserPassword,
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

    this.subject = Subject.create(
      AddInternalGroupToAcademicPeriodE2eSeed.subjectId,
      null,
      'subject',
      'code',
      null,
      null,
      SubjectModality.ELEARNING,
      null,
      SubjectType.SUBJECT,
      this.businessUnit,
      false,
      false,
      this.superAdminUser,
      null,
    );

    await this.subjectRepository.save(this.subject);

    this.academicProgram = AcademicProgram.create(
      AddInternalGroupToAcademicPeriodE2eSeed.academicProgramId,
      AddInternalGroupToAcademicPeriodE2eSeed.academicProgramName,
      AddInternalGroupToAcademicPeriodE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    this.programBlock = ProgramBlock.create(
      AddInternalGroupToAcademicPeriodE2eSeed.programBlockId,
      AddInternalGroupToAcademicPeriodE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    this.programBlock.subjects = [this.subject];
    this.academicProgram.programBlocks = [this.programBlock];

    await this.academicProgramRepository.save(this.academicProgram);
    await this.programBlockRepository.save(this.programBlock);

    this.academicPeriod = AcademicPeriod.create(
      AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodId,
      AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodName,
      AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodCode,
      new Date(AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodStartDate),
      new Date(AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      AddInternalGroupToAcademicPeriodE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);

    this.periodBlock = PeriodBlock.create(
      AddInternalGroupToAcademicPeriodE2eSeed.periodBlockId,
      this.academicPeriod,
      AddInternalGroupToAcademicPeriodE2eSeed.name,
      this.academicPeriod.startDate,
      this.academicPeriod.endDate,
      this.superAdminUser,
    );

    this.academicPeriod.periodBlocks = [this.periodBlock];
    await this.academicPeriodRepository.save(this.academicPeriod);
    await this.periodBlockRepository.save(this.periodBlock);

    await this.blockRelationRepository.save(
      BlockRelation.create(
        AddInternalGroupToAcademicPeriodE2eSeed.blockRelationId,
        this.periodBlock,
        this.programBlock,
        this.superAdminUser,
      ),
    );

    this.edaeUser = await this.edaeUserRepository.save(
      EdaeUser.create(
        AddInternalGroupToAcademicPeriodE2eSeed.edaeUserId,
        'teacher',
        'teacherson',
        'the third',
        'teacher@universae.com',
        new IdentityDocument({
          identityDocumentType: IdentityDocumentType.DNI,
          identityDocumentNumber: '74700994F',
        }),
        [EdaeRoles.TUTOR],
        [this.businessUnit],
        TimeZoneEnum.GMT_PLUS_1,
        false,
        country,
        null,
        'password',
      ),
    );
  }

  async clear(): Promise<void> {
    await this.internalGroupRepository.delete({});
    await this.blockRelationRepository.delete({});
    await this.periodBlockRepository.delete({});
    await this.academicPeriodRepository.delete({});
    await this.programBlockRepository.delete({});
    await this.academicProgramRepository.delete({});
    await this.subjectRepository.delete({});
    await this.titleRepository.delete({});
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.edaeUserRepository.delete({});
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
