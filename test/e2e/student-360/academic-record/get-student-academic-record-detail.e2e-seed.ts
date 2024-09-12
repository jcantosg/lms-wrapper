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
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { LmsStudent } from '#lms-wrapper/domain/entity/lms-student';
import { LmsCourse } from '#lms-wrapper/domain/entity/lms-course';
import { LmsCourseCategoryEnum } from '#lms-wrapper/domain/enum/lms-course-category.enum';

export class GetStudentAcademicRecordDetailE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserSecretariaEmail = 'secretaria@email.com';
  public static adminUserSecretariaPassword = 'pass123';
  public static adminUserSecretariaId = uuid();
  public static adminUserGestor360Email = 'gestor360@email.com';
  public static adminUserGestor360Password = 'pass123';
  public static adminUserGestor360Id = uuid();

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
  public static programBlockName = 'Bloque 0';

  private static periodBlockId = uuid();

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static studentUniversaeEmail = 'juan.ros@universae.com';
  public static studentPassword = 'pass123';

  public static academicRecordId = uuid();
  public static academicRecordIsModular = false;

  private static blockRelationId = uuid();
  private static enrollmentId = uuid();

  private superAdminUser: AdminUser;
  private adminUserSecretaria: AdminUser;
  private adminUserGestor360: AdminUser;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private periodBlock: PeriodBlock;
  private blockRelation: BlockRelation;
  private student: Student;
  private title: Title;
  private academicRecord: AcademicRecord;
  private subject: Subject;
  private enrollment: Enrollment;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private periodBlockRepository: Repository<PeriodBlock>;
  private blockRelationRepository: Repository<BlockRelation>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private enrollmentRepository: Repository<Enrollment>;
  private subjectRepository: Repository<Subject>;
  private evaluationTypeRepository: Repository<EvaluationType>;

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
    this.blockRelationRepository =
      datasource.getRepository(blockRelationSchema);
    this.periodBlockRepository = datasource.getRepository(periodBlockSchema);
    this.enrollmentRepository = datasource.getRepository(enrollmentSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      GetStudentAcademicRecordDetailE2eSeed.businessUnitId,
      GetStudentAcademicRecordDetailE2eSeed.businessUnitName,
      GetStudentAcademicRecordDetailE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      GetStudentAcademicRecordDetailE2eSeed.secondBusinessUnitId,
      GetStudentAcademicRecordDetailE2eSeed.secondBusinessUnitName,
      GetStudentAcademicRecordDetailE2eSeed.secondBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.virtualCampus = VirtualCampus.create(
      GetStudentAcademicRecordDetailE2eSeed.virtualCampusId,
      GetStudentAcademicRecordDetailE2eSeed.virtualCampusName,
      GetStudentAcademicRecordDetailE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetStudentAcademicRecordDetailE2eSeed.superAdminUserId,
      GetStudentAcademicRecordDetailE2eSeed.superAdminUserEmail,
      GetStudentAcademicRecordDetailE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUserSecretaria = await createAdminUser(
      this.datasource,
      GetStudentAcademicRecordDetailE2eSeed.adminUserSecretariaId,
      GetStudentAcademicRecordDetailE2eSeed.adminUserSecretariaEmail,
      GetStudentAcademicRecordDetailE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.secondBusinessUnit],
    );

    this.adminUserGestor360 = await createAdminUser(
      this.datasource,
      GetStudentAcademicRecordDetailE2eSeed.adminUserGestor360Id,
      GetStudentAcademicRecordDetailE2eSeed.adminUserGestor360Email,
      GetStudentAcademicRecordDetailE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.title = Title.create(
      GetStudentAcademicRecordDetailE2eSeed.titleId,
      GetStudentAcademicRecordDetailE2eSeed.titleName,
      GetStudentAcademicRecordDetailE2eSeed.titleOfficialCode,
      GetStudentAcademicRecordDetailE2eSeed.titleOfficialTitle,
      GetStudentAcademicRecordDetailE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      GetStudentAcademicRecordDetailE2eSeed.academicProgramId,
      GetStudentAcademicRecordDetailE2eSeed.academicProgramName,
      GetStudentAcademicRecordDetailE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      GetStudentAcademicRecordDetailE2eSeed.academicPeriodId,
      GetStudentAcademicRecordDetailE2eSeed.academicPeriodName,
      GetStudentAcademicRecordDetailE2eSeed.academicPeriodCode,
      new Date(GetStudentAcademicRecordDetailE2eSeed.academicPeriodStartDate),
      new Date(GetStudentAcademicRecordDetailE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      GetStudentAcademicRecordDetailE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    this.periodBlock = PeriodBlock.create(
      GetStudentAcademicRecordDetailE2eSeed.periodBlockId,
      this.academicPeriod,
      'Primer bloque',
      new Date(),
      new Date(),
      this.superAdminUser,
    );
    await this.academicPeriodRepository.save(this.academicPeriod);
    await this.periodBlockRepository.save(this.periodBlock);

    this.programBlock = ProgramBlock.create(
      GetStudentAcademicRecordDetailE2eSeed.programBlockId,
      GetStudentAcademicRecordDetailE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    const evaluationType = await this.evaluationTypeRepository.findOneOrFail({
      where: {
        name: 'Proyecto',
      },
    });
    this.subject = Subject.create(
      uuid(),
      null,
      'Prueba',
      'PRO1',
      null,
      40,
      SubjectModality.ELEARNING,
      evaluationType,
      SubjectType.ELECTIVE,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    this.subject.lmsCourse = new LmsCourse({
      id: 1675,
      categoryId: LmsCourseCategoryEnum.E_LEARNING,
      shortname: 'BAR-INSM10',
      name: 'Formación y Orientación Laboral',
      progress: 0,
      modules: [],
    });
    await this.subjectRepository.save(this.subject);
    this.programBlock.addSubject(this.subject, this.superAdminUser);

    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];
    this.blockRelation = BlockRelation.create(
      GetStudentAcademicRecordDetailE2eSeed.blockRelationId,
      this.periodBlock,
      this.programBlock,
      this.superAdminUser,
    );
    await this.blockRelationRepository.save(this.blockRelation);
    const passwordEncoder = new BCryptPasswordEncoder();

    this.student = Student.createFromSGA(
      GetStudentAcademicRecordDetailE2eSeed.studentId,
      GetStudentAcademicRecordDetailE2eSeed.studentName,
      GetStudentAcademicRecordDetailE2eSeed.studentSurname,
      GetStudentAcademicRecordDetailE2eSeed.studentSurname2,
      GetStudentAcademicRecordDetailE2eSeed.studentEmail,
      GetStudentAcademicRecordDetailE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(
        GetStudentAcademicRecordDetailE2eSeed.studentPassword,
      ),
      new LmsStudent({
        id: 12453,
        username: 'borja.postigo',
        firstName: 'Borja',
        lastName: 'Postigo',
        email: 'borja@secture.com',
        password: '123',
      }),
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      GetStudentAcademicRecordDetailE2eSeed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      GetStudentAcademicRecordDetailE2eSeed.academicRecordIsModular,
      this.superAdminUser,
    );

    await this.academicRecordRepository.save(this.academicRecord);

    this.enrollment = Enrollment.create(
      GetStudentAcademicRecordDetailE2eSeed.enrollmentId,
      this.subject,
      this.academicRecord,
      EnrollmentVisibilityEnum.YES,
      EnrollmentTypeEnum.CV,
      this.programBlock,
      this.superAdminUser,
    );
    await this.enrollmentRepository.save(this.enrollment);
  }

  async clear(): Promise<void> {
    await this.enrollmentRepository.delete(this.enrollment.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.academicRecordRepository.delete(
      GetStudentAcademicRecordDetailE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.blockRelationRepository.delete(this.blockRelation.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.periodBlockRepository.delete(this.periodBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.datasource, this.adminUserSecretaria);
    await removeAdminUser(this.datasource, this.adminUserGestor360);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
