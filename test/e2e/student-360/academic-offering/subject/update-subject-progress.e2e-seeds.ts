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
  getALmsStudent,
  getAnIdentityDocument,
} from '#test/value-object-factory';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { LmsCourseRepository } from '#lms-wrapper/domain/repository/lms-course.repository';
import { MoodleCourseRepository } from '#lms-wrapper/infrastructure/repository/moodle-course.repository';
import {
  MoodleCourseModuleStatus,
  MoodleWrapper,
} from '#lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import process from 'node:process';
import { Logger } from '@nestjs/common';

export class UpdateSubjectProgressE2Seed implements E2eSeed {
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

  public static courseModuleId = 512453;

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
  private lmsCourseRepository: LmsCourseRepository;

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
    this.lmsCourseRepository = new MoodleCourseRepository(
      new MoodleWrapper(
        new FetchWrapper(process.env.LMS_URL!, new Logger()),
        process.env.LMS_TOKEN!,
      ),
    );
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      UpdateSubjectProgressE2Seed.businessUnitId,
      UpdateSubjectProgressE2Seed.businessUnitName,
      UpdateSubjectProgressE2Seed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      UpdateSubjectProgressE2Seed.secondBusinessUnitId,
      UpdateSubjectProgressE2Seed.secondBusinessUnitName,
      UpdateSubjectProgressE2Seed.secondBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.virtualCampus = VirtualCampus.create(
      UpdateSubjectProgressE2Seed.virtualCampusId,
      UpdateSubjectProgressE2Seed.virtualCampusName,
      UpdateSubjectProgressE2Seed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      UpdateSubjectProgressE2Seed.superAdminUserId,
      UpdateSubjectProgressE2Seed.superAdminUserEmail,
      UpdateSubjectProgressE2Seed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = Title.create(
      UpdateSubjectProgressE2Seed.titleId,
      UpdateSubjectProgressE2Seed.titleName,
      UpdateSubjectProgressE2Seed.titleOfficialCode,
      UpdateSubjectProgressE2Seed.titleOfficialTitle,
      UpdateSubjectProgressE2Seed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      UpdateSubjectProgressE2Seed.academicProgramId,
      UpdateSubjectProgressE2Seed.academicProgramName,
      UpdateSubjectProgressE2Seed.academicProgramCode,
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
      UpdateSubjectProgressE2Seed.subjectId,
      null,
      UpdateSubjectProgressE2Seed.subjectName,
      UpdateSubjectProgressE2Seed.subjectCode,
      null,
      null,
      UpdateSubjectProgressE2Seed.subjectModality,
      evaluationType,
      UpdateSubjectProgressE2Seed.subjectType,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    this.subject.addLmsCourse(getALmsCourse(5635, 'Test'));
    await this.subjectRepository.save(this.subject);
    this.nonEnrolledSubject = Subject.create(
      UpdateSubjectProgressE2Seed.nonEnrolledSubjectId,
      null,
      UpdateSubjectProgressE2Seed.nonEnrolledSubjectIdSubjectName,
      UpdateSubjectProgressE2Seed.nonEnrolledSubjectIdSubjectCode,
      null,
      null,
      UpdateSubjectProgressE2Seed.nonEnrolledSubjectModality,
      evaluationType,
      UpdateSubjectProgressE2Seed.nonEnrolledSubjectType,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.nonEnrolledSubject);

    this.academicPeriod = AcademicPeriod.create(
      UpdateSubjectProgressE2Seed.academicPeriodId,
      UpdateSubjectProgressE2Seed.academicPeriodName,
      UpdateSubjectProgressE2Seed.academicPeriodCode,
      new Date(UpdateSubjectProgressE2Seed.academicPeriodStartDate),
      new Date(UpdateSubjectProgressE2Seed.academicPeriodEndDate),
      this.businessUnit,
      UpdateSubjectProgressE2Seed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      UpdateSubjectProgressE2Seed.programBlockId,
      UpdateSubjectProgressE2Seed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    this.programBlock.addSubject(this.subject, this.superAdminUser);
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];
    const passwordEncoder = new BCryptPasswordEncoder();

    this.student = Student.createFromSGA(
      UpdateSubjectProgressE2Seed.studentId,
      UpdateSubjectProgressE2Seed.studentName,
      UpdateSubjectProgressE2Seed.studentSurname,
      UpdateSubjectProgressE2Seed.studentSurname2,
      UpdateSubjectProgressE2Seed.studentEmail,
      UpdateSubjectProgressE2Seed.studentUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(
        UpdateSubjectProgressE2Seed.studentPassword,
      ),
      null,
    );
    this.student.lmsStudent = getALmsStudent(8389);
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      UpdateSubjectProgressE2Seed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      UpdateSubjectProgressE2Seed.academicRecordIsModular,
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
    await this.lmsCourseRepository.updateCourseModuleStatus(
      UpdateSubjectProgressE2Seed.courseModuleId,
      this.student.lmsStudent!.value.id,
      MoodleCourseModuleStatus.NON_COMPLETED,
    );
    await this.academicRecordRepository.delete(
      UpdateSubjectProgressE2Seed.academicRecordId,
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
