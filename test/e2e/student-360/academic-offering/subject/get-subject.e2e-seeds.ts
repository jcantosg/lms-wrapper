import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { Student } from '#shared/domain/entity/student.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import {
  getALmsCourse,
  getAnIdentityDocument,
} from '#test/value-object-factory';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class GetSubjectE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2035';
  public static academicPeriodCode = 'MAD-2023-2035';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 1;

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static secondBusinessUnitId = uuid();
  public static secondBusinessUnitName = 'Barcelona';
  public static secondBusinessUnitCode = 'BCN';

  public static virtualCampusId = uuid();
  public static virtualCampusName = 'Campus virtual de Madrid';
  public static virtualCampusCode = 'CVM';

  public static titleId = uuid();
  public static titleName = 'Ingenieria informatica';
  public static titleOfficialCode = 'II';
  public static titleOfficialTitle = 'Ingeniero informatico';
  public static titleOfficialProgram = 'Ingenieria informatica';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static studentUniversaeEmail = 'juan.ros@universae.com';
  public static studentPassword = 'pass123';

  public static academicRecordId = uuid();
  public static academicRecordIsModular = false;

  public static subjectId = uuid();
  public static subjectName: string = 'Algoritmos y Estructuras de Datos';
  public static subjectCode: string = 'AED';
  public static subjectModality: SubjectModality = SubjectModality.PRESENCIAL;
  private static subjectType: SubjectType = SubjectType.SUBJECT;

  public static nonEnrolledSubjectId = uuid();
  public static nonEnrolledSubjectIdSubjectName: string =
    'Automátas y Lenguajes Formales';
  public static nonEnrolledSubjectIdSubjectCode: string = 'ALF';
  public static nonEnrolledSubjectModality: SubjectModality =
    SubjectModality.PRESENCIAL;
  private static nonEnrolledSubjectType: SubjectType = SubjectType.SUBJECT;

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private student: Student;
  private title: Title;
  private academicRecord: AcademicRecord;
  private subject: Subject;
  private nonEnrolledSubject: Subject;
  private internalGroup: InternalGroup;
  private edaeUser: EdaeUser;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private subjectRepository: Repository<Subject>;
  private internalGroupRepository: Repository<InternalGroup>;
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
    this.studentRepository = datasource.getRepository(studentSchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
    this.academicRecordRepository =
      datasource.getRepository(academicRecordSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
    this.internalGroupRepository =
      datasource.getRepository(internalGroupSchema);
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      GetSubjectE2eSeed.businessUnitId,
      GetSubjectE2eSeed.businessUnitName,
      GetSubjectE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      GetSubjectE2eSeed.secondBusinessUnitId,
      GetSubjectE2eSeed.secondBusinessUnitName,
      GetSubjectE2eSeed.secondBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.virtualCampus = VirtualCampus.create(
      GetSubjectE2eSeed.virtualCampusId,
      GetSubjectE2eSeed.virtualCampusName,
      GetSubjectE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetSubjectE2eSeed.superAdminUserId,
      GetSubjectE2eSeed.superAdminUserEmail,
      GetSubjectE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = Title.create(
      GetSubjectE2eSeed.titleId,
      GetSubjectE2eSeed.titleName,
      GetSubjectE2eSeed.titleOfficialCode,
      GetSubjectE2eSeed.titleOfficialTitle,
      GetSubjectE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      GetSubjectE2eSeed.academicProgramId,
      GetSubjectE2eSeed.academicProgramName,
      GetSubjectE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      name: 'Distancia FP',
    });
    this.subject = Subject.create(
      GetSubjectE2eSeed.subjectId,
      null,
      GetSubjectE2eSeed.subjectName,
      GetSubjectE2eSeed.subjectCode,
      null,
      null,
      GetSubjectE2eSeed.subjectModality,
      evaluationType,
      GetSubjectE2eSeed.subjectType,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    this.subject.addLmsCourse(getALmsCourse(2, 'Test'));
    await this.subjectRepository.save(this.subject);
    this.nonEnrolledSubject = Subject.create(
      GetSubjectE2eSeed.nonEnrolledSubjectId,
      null,
      GetSubjectE2eSeed.nonEnrolledSubjectIdSubjectName,
      GetSubjectE2eSeed.nonEnrolledSubjectIdSubjectCode,
      null,
      null,
      GetSubjectE2eSeed.nonEnrolledSubjectModality,
      evaluationType,
      GetSubjectE2eSeed.nonEnrolledSubjectType,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.nonEnrolledSubject);

    this.academicPeriod = AcademicPeriod.create(
      GetSubjectE2eSeed.academicPeriodId,
      GetSubjectE2eSeed.academicPeriodName,
      GetSubjectE2eSeed.academicPeriodCode,
      new Date(GetSubjectE2eSeed.academicPeriodStartDate),
      new Date(GetSubjectE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      GetSubjectE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      GetSubjectE2eSeed.programBlockId,
      GetSubjectE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    this.programBlock.addSubject(this.subject, this.superAdminUser);
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];
    const passwordEncoder = new BCryptPasswordEncoder();

    this.student = Student.createFromSGA(
      GetSubjectE2eSeed.studentId,
      GetSubjectE2eSeed.studentName,
      GetSubjectE2eSeed.studentSurname,
      GetSubjectE2eSeed.studentSurname2,
      GetSubjectE2eSeed.studentEmail,
      GetSubjectE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(GetSubjectE2eSeed.studentPassword),
      null,
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      GetSubjectE2eSeed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      GetSubjectE2eSeed.academicRecordIsModular,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.academicRecord);
    this.edaeUser = EdaeUser.create(
      uuid(),
      'Jose',
      'Cantos',
      null,
      'jose@universae.com',
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE],
      [this.businessUnit],
      TimeZoneEnum.GMT_MINUS_1,
      true,
      country,
      null,
      'ejemplo',
    );
    await this.edaeUserRepository.save(this.edaeUser);
    this.internalGroup = InternalGroup.create(
      uuid(),
      'TEST',
      [this.student],
      [this.edaeUser],
      this.academicPeriod,
      this.academicProgram,
      this.academicPeriod.periodBlocks[0],
      this.subject,
      this.businessUnit,
      true,
      this.superAdminUser,
      this.edaeUser,
    );

    await this.internalGroupRepository.save(this.internalGroup);
  }

  async clear(): Promise<void> {
    await this.academicRecordRepository.delete(
      GetSubjectE2eSeed.academicRecordId,
    );
    await this.internalGroupRepository.delete(this.internalGroup.id);
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.studentRepository.delete(this.student.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.subjectRepository.delete(this.nonEnrolledSubject.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
