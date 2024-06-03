import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
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
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { Student } from '#shared/domain/entity/student.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';

export class DeleteEnrollmentE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2035';
  public static academicPeriodCode = 'MAD-2023-2035';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 1;

  private static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc72';
  private static businessUnitName = 'Madrid';
  private static businessUnitCode = 'MAD';

  private static virtualCampusId = uuid();
  private static virtualCampusName = 'Campus virtual de Madrid';
  private static virtualCampusCode = 'CVM';

  private static academicProgramId = uuid();
  private static academicProgramName =
    'Administración de sistemas informaticos en red';
  private static academicProgramCode = 'ASIR';

  private static programBlockId = uuid();
  private static programBlockName = 'Bloque 1';

  public static subjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  private static subjectName = 'Algoritmos y Estructuras de Datos';
  private static subjectCode = 'UniversaeAED';
  private static subjectHours = 32;
  private static subjectModality = SubjectModality.PRESENCIAL;
  private static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  private static subjectType = SubjectType.SUBJECT;
  private static subjectIsRegulated = true;
  private static subjectIsCore = true;

  private static studentId = uuid();
  private static studentName = 'Juan';
  private static studentSurname = 'Ros';
  private static studentSurname2 = 'Lopez';
  private static studentEmail = 'juan@test.org';
  private static universaeEmail = 'juan.ros@universae.com';

  public static academicRecordId = 'a4d5dfb8-9609-444c-9d5e-7d05bf6d4df7';

  public static enrollmentId = 'd3087949-3d62-4eaf-a179-c569d02b6ee6';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private academicRecord: AcademicRecord;
  private programBlock: ProgramBlock;
  private student: Student;
  private title: Title;
  private subject: Subject;
  private enrollment: Enrollment;

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
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.studentRepository = datasource.getRepository(studentSchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
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
      DeleteEnrollmentE2eSeed.businessUnitId,
      DeleteEnrollmentE2eSeed.businessUnitName,
      DeleteEnrollmentE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.create(
      DeleteEnrollmentE2eSeed.virtualCampusId,
      DeleteEnrollmentE2eSeed.virtualCampusName,
      DeleteEnrollmentE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      DeleteEnrollmentE2eSeed.superAdminUserId,
      DeleteEnrollmentE2eSeed.superAdminUserEmail,
      DeleteEnrollmentE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      DeleteEnrollmentE2eSeed.adminUserId,
      DeleteEnrollmentE2eSeed.adminUserEmail,
      DeleteEnrollmentE2eSeed.adminUserPassword,
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
      DeleteEnrollmentE2eSeed.academicProgramId,
      DeleteEnrollmentE2eSeed.academicProgramName,
      DeleteEnrollmentE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      DeleteEnrollmentE2eSeed.academicPeriodId,
      DeleteEnrollmentE2eSeed.academicPeriodName,
      DeleteEnrollmentE2eSeed.academicPeriodCode,
      new Date(DeleteEnrollmentE2eSeed.academicPeriodStartDate),
      new Date(DeleteEnrollmentE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      DeleteEnrollmentE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      DeleteEnrollmentE2eSeed.programBlockId,
      DeleteEnrollmentE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: DeleteEnrollmentE2eSeed.subjectEvaluationType,
    });
    this.subject = Subject.create(
      DeleteEnrollmentE2eSeed.subjectId,
      null,
      DeleteEnrollmentE2eSeed.subjectName,
      DeleteEnrollmentE2eSeed.subjectCode,
      null,
      DeleteEnrollmentE2eSeed.subjectHours,
      DeleteEnrollmentE2eSeed.subjectModality,
      evaluationType,
      DeleteEnrollmentE2eSeed.subjectType,
      this.businessUnit,
      DeleteEnrollmentE2eSeed.subjectIsRegulated,
      DeleteEnrollmentE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);
    this.programBlock.addSubject(this.subject, this.superAdminUser);
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];
    this.academicRecord = AcademicRecord.create(
      DeleteEnrollmentE2eSeed.academicRecordId,
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

    this.student = Student.createFromSGA(
      DeleteEnrollmentE2eSeed.studentId,
      DeleteEnrollmentE2eSeed.studentName,
      DeleteEnrollmentE2eSeed.studentSurname,
      DeleteEnrollmentE2eSeed.studentSurname2,
      DeleteEnrollmentE2eSeed.studentEmail,
      DeleteEnrollmentE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
    );
    await this.studentRepository.save(this.student);
    this.enrollment = Enrollment.create(
      DeleteEnrollmentE2eSeed.enrollmentId,
      this.subject,
      this.academicRecord,
      EnrollmentVisibilityEnum.YES,
      EnrollmentTypeEnum.UNIVERSAE,
      this.programBlock,
      this.superAdminUser,
    );
    const subjectCall = SubjectCall.create(
      uuid(),
      this.enrollment,
      1,
      new Date(),
      SubjectCallFinalGradeEnum.EIGHT,
      SubjectCallStatusEnum.PASSED,
      this.superAdminUser,
    );
    await this.enrollmentRepository.save(this.enrollment);
    await this.subjectCallRepository.save(subjectCall);
  }

  async clear(): Promise<void> {
    const subjectCalls = await this.subjectCallRepository.find();
    await this.subjectCallRepository.delete(
      subjectCalls.map((subject) => subject.id),
    );
    await this.enrollmentRepository.delete(
      DeleteEnrollmentE2eSeed.enrollmentId,
    );
    await this.academicRecordRepository.delete(
      DeleteEnrollmentE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicRecordRepository.delete(
      DeleteEnrollmentE2eSeed.academicRecordId,
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
