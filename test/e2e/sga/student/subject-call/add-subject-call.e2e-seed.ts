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
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { subjectCallScheduleHistorySchema } from '#student/infrastructure/config/schema/subject-call-schedule-history.schema';

export class AddSubjectCallE2eSeed implements E2eSeed {
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

  public static invalidAcademicPeriodId = uuid();
  public static invalidAcademicPeriodName = 'Madrid 2025 2026';
  public static invalidAcademicPeriodCode = 'M-25-26';
  public static invalidAcademicPeriodStartDate = '2025-09-01';
  public static invalidAcademicPeriodEndDate = '2026-09-01';
  public static invalidAcademicPeriodBlocksNumber = 1;

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static otherBusinessUnitId = uuid();
  public static otherBusinessUnitName = 'Madrid 2';
  public static otherBusinessUnitCode = 'MAD2';

  private static virtualCampusId = uuid();
  private static virtualCampusName = 'Campus virtual de Madrid';
  private static virtualCampusCode = 'CVM';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static invalidAcademicProgramId = uuid();
  public static invalidAcademicProgramName =
    'Administración de sistemas informaticos en red 2';
  public static invalidAcademicProgramCode = 'MAD-INAS2';

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
  private otherBusinessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private invalidAcademicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private invalidAcademicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private title: Title;
  private enrollment: Enrollment;
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
  private subjectCallScheduleHisotryRepository: Repository<SubjectCallScheduleHistory>;

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
    this.subjectCallScheduleHisotryRepository = datasource.getRepository(
      subjectCallScheduleHistorySchema,
    );
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      AddSubjectCallE2eSeed.businessUnitId,
      AddSubjectCallE2eSeed.businessUnitName,
      AddSubjectCallE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.otherBusinessUnit = BusinessUnit.create(
      AddSubjectCallE2eSeed.otherBusinessUnitId,
      AddSubjectCallE2eSeed.otherBusinessUnitName,
      AddSubjectCallE2eSeed.otherBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.otherBusinessUnit);

    this.virtualCampus = VirtualCampus.create(
      AddSubjectCallE2eSeed.virtualCampusId,
      AddSubjectCallE2eSeed.virtualCampusName,
      AddSubjectCallE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddSubjectCallE2eSeed.superAdminUserId,
      AddSubjectCallE2eSeed.superAdminUserEmail,
      AddSubjectCallE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      AddSubjectCallE2eSeed.adminUserId,
      AddSubjectCallE2eSeed.adminUserEmail,
      AddSubjectCallE2eSeed.adminUserPassword,
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
      AddSubjectCallE2eSeed.academicProgramId,
      AddSubjectCallE2eSeed.academicProgramName,
      AddSubjectCallE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.invalidAcademicProgram = AcademicProgram.create(
      AddSubjectCallE2eSeed.invalidAcademicProgramId,
      AddSubjectCallE2eSeed.invalidAcademicProgramName,
      AddSubjectCallE2eSeed.invalidAcademicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.invalidAcademicProgram);

    this.academicPeriod = AcademicPeriod.create(
      AddSubjectCallE2eSeed.academicPeriodId,
      AddSubjectCallE2eSeed.academicPeriodName,
      AddSubjectCallE2eSeed.academicPeriodCode,
      new Date(AddSubjectCallE2eSeed.academicPeriodStartDate),
      new Date(AddSubjectCallE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      AddSubjectCallE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.invalidAcademicPeriod = AcademicPeriod.create(
      AddSubjectCallE2eSeed.invalidAcademicPeriodId,
      AddSubjectCallE2eSeed.invalidAcademicPeriodName,
      AddSubjectCallE2eSeed.invalidAcademicPeriodCode,
      new Date(AddSubjectCallE2eSeed.invalidAcademicPeriodStartDate),
      new Date(AddSubjectCallE2eSeed.invalidAcademicPeriodEndDate),
      this.otherBusinessUnit,
      AddSubjectCallE2eSeed.invalidAcademicPeriodBlocksNumber,
      this.adminUser,
    );
    await this.academicPeriodRepository.save(this.invalidAcademicPeriod);

    this.programBlock = ProgramBlock.create(
      AddSubjectCallE2eSeed.programBlockId,
      AddSubjectCallE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: AddSubjectCallE2eSeed.subjectEvaluationType,
    });

    this.subject = Subject.create(
      AddSubjectCallE2eSeed.subjectId,
      null,
      AddSubjectCallE2eSeed.subjectName,
      AddSubjectCallE2eSeed.subjectCode,
      null,
      AddSubjectCallE2eSeed.subjectHours,
      AddSubjectCallE2eSeed.subjectModality,
      evaluationType,
      AddSubjectCallE2eSeed.subjectType,
      this.businessUnit,
      AddSubjectCallE2eSeed.subjectIsRegulated,
      AddSubjectCallE2eSeed.subjectIsCore,
      this.superAdminUser,
      AddSubjectCallE2eSeed.subjectOfficialRegionalCode,
    );
    await this.subjectRepository.save(this.subject);
    this.programBlock.addSubject(this.subject, this.superAdminUser);
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];

    this.student = Student.createFromSGA(
      AddSubjectCallE2eSeed.studentId,
      AddSubjectCallE2eSeed.studentName,
      AddSubjectCallE2eSeed.studentSurname,
      AddSubjectCallE2eSeed.studentSurname2,
      AddSubjectCallE2eSeed.studentEmail,
      AddSubjectCallE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
      null,
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      AddSubjectCallE2eSeed.academicRecordId,
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
      AddSubjectCallE2eSeed.enrollmentId,
      this.subject,
      this.academicRecord,
      EnrollmentVisibilityEnum.YES,
      EnrollmentTypeEnum.UNIVERSAE,
      this.programBlock,
      this.superAdminUser,
    );

    this.enrollment.maxCalls = 3;

    await this.enrollmentRepository.save(this.enrollment);
  }

  async clear(): Promise<void> {
    await this.subjectCallScheduleHisotryRepository.delete({});
    await this.subjectCallRepository.delete({});
    await this.enrollmentRepository.delete(AddSubjectCallE2eSeed.enrollmentId);
    await this.academicRecordRepository.delete(
      AddSubjectCallE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicRecordRepository.delete(
      AddSubjectCallE2eSeed.academicRecordId,
    );
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.academicPeriodRepository.delete(this.invalidAcademicPeriod.id);
    await this.academicProgramRepository.delete(this.invalidAcademicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.otherBusinessUnit.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
