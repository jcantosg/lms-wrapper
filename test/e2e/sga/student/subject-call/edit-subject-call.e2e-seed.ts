import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { Country } from '#shared/domain/entity/country.entity';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { Student } from '#shared/domain/entity/student.entity';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';

export class EditSubjectCallE2eSeed implements E2eSeed {
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
  public static academicPeriodBlocksNumber = 1;

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  private static virtualCampusId = uuid();
  private static virtualCampusName = 'Campus virtual de Madrid';
  private static virtualCampusCode = 'CVM';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';

  public static subjectId = uuid();
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 32;
  public static subjectModality = SubjectModality.PRESENCIAL;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;
  public static subjectOfficialRegionalCode = '01234';

  private static studentId = uuid();
  private static studentName = 'Juan';
  private static studentSurname = 'Ros';
  private static studentSurname2 = 'Lopez';
  private static studentEmail = 'juan@test.org';
  private static universaeEmail = 'juan.ros@universae.com';

  public static academicRecordId = uuid();
  public static enrollmentId = uuid();
  public static subjectCallId = uuid();

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private title: Title;
  private enrollment: Enrollment;
  private subjectCall: SubjectCall;
  private academicRecord: AcademicRecord;
  private subject: Subject;
  private student: Student;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private subjectRepository: Repository<Subject>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private enrollmentRepository: Repository<Enrollment>;
  private subjectCallRepository: Repository<SubjectCall>;

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
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
    this.studentRepository = datasource.getRepository(studentSchema);
    this.academicRecordRepository =
      datasource.getRepository(academicRecordSchema);
    this.enrollmentRepository = datasource.getRepository(enrollmentSchema);
    this.subjectCallRepository = datasource.getRepository(subjectCallSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      EditSubjectCallE2eSeed.businessUnitId,
      EditSubjectCallE2eSeed.businessUnitName,
      EditSubjectCallE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.create(
      EditSubjectCallE2eSeed.virtualCampusId,
      EditSubjectCallE2eSeed.virtualCampusName,
      EditSubjectCallE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditSubjectCallE2eSeed.superAdminUserId,
      EditSubjectCallE2eSeed.superAdminUserEmail,
      EditSubjectCallE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      EditSubjectCallE2eSeed.adminUserId,
      EditSubjectCallE2eSeed.adminUserEmail,
      EditSubjectCallE2eSeed.adminUserPassword,
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
      EditSubjectCallE2eSeed.academicProgramId,
      EditSubjectCallE2eSeed.academicProgramName,
      EditSubjectCallE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      EditSubjectCallE2eSeed.academicPeriodId,
      EditSubjectCallE2eSeed.academicPeriodName,
      EditSubjectCallE2eSeed.academicPeriodCode,
      new Date(EditSubjectCallE2eSeed.academicPeriodStartDate),
      new Date(EditSubjectCallE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      EditSubjectCallE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      EditSubjectCallE2eSeed.programBlockId,
      EditSubjectCallE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: EditSubjectCallE2eSeed.subjectEvaluationType,
    });

    this.subject = Subject.create(
      EditSubjectCallE2eSeed.subjectId,
      null,
      EditSubjectCallE2eSeed.subjectName,
      EditSubjectCallE2eSeed.subjectCode,
      null,
      EditSubjectCallE2eSeed.subjectHours,
      EditSubjectCallE2eSeed.subjectModality,
      evaluationType,
      EditSubjectCallE2eSeed.subjectType,
      this.businessUnit,
      EditSubjectCallE2eSeed.subjectIsRegulated,
      EditSubjectCallE2eSeed.subjectIsCore,
      this.superAdminUser,
      EditSubjectCallE2eSeed.subjectOfficialRegionalCode,
    );
    await this.subjectRepository.save(this.subject);
    this.programBlock.addSubject(this.subject, this.superAdminUser);
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];

    this.student = Student.createFromSGA(
      EditSubjectCallE2eSeed.studentId,
      EditSubjectCallE2eSeed.studentName,
      EditSubjectCallE2eSeed.studentSurname,
      EditSubjectCallE2eSeed.studentSurname2,
      EditSubjectCallE2eSeed.studentEmail,
      EditSubjectCallE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
      null,
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      EditSubjectCallE2eSeed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.PRESENCIAL,
      true,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.academicRecord);

    this.enrollment = Enrollment.create(
      EditSubjectCallE2eSeed.enrollmentId,
      this.subject,
      this.academicRecord,
      EnrollmentVisibilityEnum.YES,
      EnrollmentTypeEnum.UNIVERSAE,
      this.programBlock,
      this.superAdminUser,
    );

    this.subjectCall = SubjectCall.create(
      EditSubjectCallE2eSeed.subjectCallId,
      this.enrollment,
      1,
      new Date(),
      SubjectCallFinalGradeEnum.EIGHT,
      SubjectCallStatusEnum.PASSED,
      this.superAdminUser,
    );
    await this.enrollmentRepository.save(this.enrollment);
    await this.subjectCallRepository.save(this.subjectCall);
  }

  async clear(): Promise<void> {
    const subjectCalls = await this.subjectCallRepository.find();
    await this.subjectCallRepository.delete(
      subjectCalls.map((subject) => subject.id),
    );
    await this.enrollmentRepository.delete(EditSubjectCallE2eSeed.enrollmentId);
    await this.academicRecordRepository.delete(
      EditSubjectCallE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicRecordRepository.delete(
      EditSubjectCallE2eSeed.academicRecordId,
    );
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
