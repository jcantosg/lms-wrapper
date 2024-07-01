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
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
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
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class GetAllInternalGroupsE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = '3ee76690-78b1-4515-8f74-683a3fe6db1a';
  public static adminUserEmail = 'user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '7dbceb0e-8e1c-4052-b2b8-3e7d753221d4';

  public static businessUnitId = '8c063e8d-f3c5-4be2-b471-f546b2b714cc';
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static anotherBusinessUnitId = 'd0e2fe59-d266-4ddc-9f7b-945b05a78745';
  public static anotherBusinessUnitName = 'Madrid2';
  public static anotherBusinessUnitCode = 'MAD2';

  public static academicPeriodId = 'af9cb84a-e7f8-4fca-9e92-1bbe2c32ca83';
  public static academicPeriodName = 'Madrid 2023 2025';
  public static academicPeriodCode = 'M-23-25';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 1;

  public static academicProgramId = '23de9031-56c0-4585-a239-95406f6459f9';
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static programBlockId = '1a9a9fd2-c2fd-4671-bf1c-b444167c13ee';
  public static programBlockName = 'Bloque 1';

  public static periodBlockId = 'ff172625-6250-4754-9dfb-6988b3ca1c34';
  public static periodBlockName = 'Bloque 1';

  public static blockRelationId = 'cb2f1064-f3c1-468f-aa7b-22ce9c2b793f';

  public static subjectId = '8039b275-3b61-4e19-8f8a-3ad6b0008308';

  public static internalGroupId = '9df6e69d-b5b7-4b6a-bcb5-1d87b83f4086';
  public static internalGroupCode = 'code';

  public static edaeUserId = '71aedcb1-b310-442d-817b-1bd8a9648e24';
  public static anotherEdaeUserId = '98434bcd-4c08-4757-ac26-131ec1cc18fd';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private anotherBusinessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private title: Title;
  private programBlock: ProgramBlock;
  private periodBlock: PeriodBlock;
  private subject: Subject;
  private internalGroup: InternalGroup;

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
      GetAllInternalGroupsE2eSeed.businessUnitId,
      GetAllInternalGroupsE2eSeed.businessUnitName,
      GetAllInternalGroupsE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.anotherBusinessUnit = BusinessUnit.create(
      GetAllInternalGroupsE2eSeed.anotherBusinessUnitId,
      GetAllInternalGroupsE2eSeed.anotherBusinessUnitName,
      GetAllInternalGroupsE2eSeed.anotherBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.anotherBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllInternalGroupsE2eSeed.superAdminUserId,
      GetAllInternalGroupsE2eSeed.superAdminUserEmail,
      GetAllInternalGroupsE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      GetAllInternalGroupsE2eSeed.adminUserId,
      GetAllInternalGroupsE2eSeed.adminUserEmail,
      GetAllInternalGroupsE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    await this.edaeUserRepository.save(
      EdaeUser.create(
        GetAllInternalGroupsE2eSeed.anotherEdaeUserId,
        'name',
        'surname',
        null,
        'email@email.com',
        new IdentityDocument({
          identityDocumentNumber: '73211519N',
          identityDocumentType: IdentityDocumentType.DNI,
        }),
        [EdaeRoles.TUTOR],
        [this.anotherBusinessUnit],
        TimeZoneEnum.GMT,
        true,
        country,
        null,
        'password',
      ),
    );

    await this.edaeUserRepository.save(
      EdaeUser.create(
        GetAllInternalGroupsE2eSeed.edaeUserId,
        'pepe',
        'perez',
        null,
        'pepe@email.com',
        new IdentityDocument({
          identityDocumentNumber: '73211519N',
          identityDocumentType: IdentityDocumentType.DNI,
        }),
        [EdaeRoles.TUTOR],
        [this.businessUnit],
        TimeZoneEnum.GMT,
        true,
        country,
        null,
        'password',
      ),
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
      GetAllInternalGroupsE2eSeed.subjectId,
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
      GetAllInternalGroupsE2eSeed.academicProgramId,
      GetAllInternalGroupsE2eSeed.academicProgramName,
      GetAllInternalGroupsE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    this.programBlock = ProgramBlock.create(
      GetAllInternalGroupsE2eSeed.programBlockId,
      GetAllInternalGroupsE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    this.programBlock.subjects = [this.subject];
    this.academicProgram.programBlocks = [this.programBlock];

    await this.academicProgramRepository.save(this.academicProgram);
    await this.programBlockRepository.save(this.programBlock);

    this.academicPeriod = AcademicPeriod.create(
      GetAllInternalGroupsE2eSeed.academicPeriodId,
      GetAllInternalGroupsE2eSeed.academicPeriodName,
      GetAllInternalGroupsE2eSeed.academicPeriodCode,
      new Date(GetAllInternalGroupsE2eSeed.academicPeriodStartDate),
      new Date(GetAllInternalGroupsE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      GetAllInternalGroupsE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);

    this.periodBlock = PeriodBlock.create(
      GetAllInternalGroupsE2eSeed.periodBlockId,
      this.academicPeriod,
      GetAllInternalGroupsE2eSeed.name,
      this.academicPeriod.startDate,
      this.academicPeriod.endDate,
      this.superAdminUser,
    );

    this.academicPeriod.periodBlocks = [this.periodBlock];
    await this.academicPeriodRepository.save(this.academicPeriod);
    await this.periodBlockRepository.save(this.periodBlock);

    await this.blockRelationRepository.save(
      BlockRelation.create(
        GetAllInternalGroupsE2eSeed.blockRelationId,
        this.periodBlock,
        this.programBlock,
        this.superAdminUser,
      ),
    );

    this.internalGroup = InternalGroup.create(
      GetAllInternalGroupsE2eSeed.internalGroupId,
      GetAllInternalGroupsE2eSeed.internalGroupCode,
      [],
      [],
      this.academicPeriod,
      this.academicProgram,
      this.periodBlock,
      this.subject,
      this.businessUnit,
      true,
      this.superAdminUser,
      this.subject.defaultTeacher,
    );

    await this.internalGroupRepository.save(this.internalGroup);
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
    await this.edaeUserRepository.delete({});
    await this.businessUnitRepository.delete({});
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
