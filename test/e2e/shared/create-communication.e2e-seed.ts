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
import { Student } from '#shared/domain/entity/student.entity';
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
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { Communication } from '#shared/domain/entity/communication.entity';
import { CommunicationSchema } from '#shared/infrastructure/config/schema/communication.schema';

export class CreateCommunicationE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = uuid();
  public static businessUnitName = 'México';
  public static businessUnitCode = 'MEX';

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Periodo Académico Test';
  public static academicPeriodCode = 'PAT001';
  public static academicPeriodStartDate = '2024-06-18T07:37:48.889Z';
  public static academicPeriodEndDate = '2024-12-18T07:37:48.889Z';
  public static academicPeriodBlocksNumber = 1;

  public static internalGroupId = uuid();

  public static academicProgramId = uuid();
  public static academicProgramName = 'Programa Formativo';
  public static academicProgramCode = 'PF01';

  public static periodBlockId = uuid();
  public static periodBlockName = 'Bloque 1';

  public static subjectId = uuid();
  public static subjectName = 'Asignatura 1';

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static universaeEmail = 'juan.ros@universae.com';

  public static titleId = uuid();

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private periodBlock: PeriodBlock;
  private subject: Subject;
  private title: Title;
  private programBlock: ProgramBlock;
  private student: Student;
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
  private studentRepository: Repository<Student>;
  private communicationRepository: Repository<Communication>;

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
    this.studentRepository = datasource.getRepository(studentSchema);
    this.communicationRepository =
      datasource.getRepository(CommunicationSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      CreateCommunicationE2eSeed.businessUnitId,
      CreateCommunicationE2eSeed.businessUnitName,
      CreateCommunicationE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateCommunicationE2eSeed.superAdminUserId,
      CreateCommunicationE2eSeed.superAdminUserEmail,
      CreateCommunicationE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateCommunicationE2eSeed.adminUserId,
      CreateCommunicationE2eSeed.adminUserEmail,
      CreateCommunicationE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
      [this.businessUnit],
    );

    this.title = Title.create(
      CreateCommunicationE2eSeed.titleId,
      'title',
      'officialCode',
      'officialTitle',
      'officialProgram',
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.subject = Subject.create(
      CreateCommunicationE2eSeed.subjectId,
      null,
      CreateCommunicationE2eSeed.subjectName,
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
      CreateCommunicationE2eSeed.academicProgramId,
      CreateCommunicationE2eSeed.academicProgramName,
      CreateCommunicationE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    this.programBlock = ProgramBlock.create(
      uuid(),
      'Program Block',
      this.academicProgram,
      this.superAdminUser,
    );

    this.programBlock.subjects = [this.subject];
    this.academicProgram.programBlocks = [this.programBlock];
    await this.academicProgramRepository.save(this.academicProgram);
    await this.programBlockRepository.save(this.programBlock);

    this.academicPeriod = AcademicPeriod.create(
      CreateCommunicationE2eSeed.academicPeriodId,
      CreateCommunicationE2eSeed.academicPeriodName,
      CreateCommunicationE2eSeed.academicPeriodCode,
      new Date(CreateCommunicationE2eSeed.academicPeriodStartDate),
      new Date(CreateCommunicationE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      CreateCommunicationE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms = [this.academicProgram];

    this.periodBlock = PeriodBlock.create(
      CreateCommunicationE2eSeed.periodBlockId,
      this.academicPeriod,
      CreateCommunicationE2eSeed.periodBlockName,
      new Date(CreateCommunicationE2eSeed.academicPeriodStartDate),
      new Date(CreateCommunicationE2eSeed.academicPeriodEndDate),
      this.superAdminUser,
    );

    this.academicPeriod.periodBlocks = [this.periodBlock];
    await this.academicPeriodRepository.save(this.academicPeriod);
    await this.periodBlockRepository.save(this.periodBlock);

    await this.blockRelationRepository.save(
      BlockRelation.create(
        uuid(),
        this.periodBlock,
        this.programBlock,
        this.superAdminUser,
      ),
    );

    this.internalGroup = InternalGroup.create(
      CreateCommunicationE2eSeed.internalGroupId,
      'InternalGroupCode',
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

    this.student = Student.createFromSGA(
      CreateCommunicationE2eSeed.studentId,
      CreateCommunicationE2eSeed.studentName,
      CreateCommunicationE2eSeed.studentSurname,
      CreateCommunicationE2eSeed.studentSurname2,
      CreateCommunicationE2eSeed.studentEmail,
      CreateCommunicationE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
      null,
    );
    await this.studentRepository.save(this.student);
  }

  async clear(): Promise<void> {
    await this.internalGroupRepository.delete({});
    await this.blockRelationRepository.delete({});
    await this.periodBlockRepository.delete({});
    await this.academicPeriodRepository.delete({});
    await this.programBlockRepository.delete({});
    await this.academicProgramRepository.delete({});
    await this.subjectRepository.delete({});
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.studentRepository.delete(this.student.id);
    await this.communicationRepository.delete({});
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
