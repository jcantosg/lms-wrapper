import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Student } from '#shared/domain/entity/student.entity';
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
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { getALmsCourse, getALmsStudent } from '#test/value-object-factory';

export class CreateEnrollmentE2eSeed implements E2eSeed {
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

  public static otherSubjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea65';
  private static otherSubjectName = 'Algoritmos y Estructuras de Datos 2';
  private static otherSubjectCode = 'UniversaeAED2';

  public static studentId = uuid();
  private static studentName = 'Juan';
  private static studentSurname = 'Ros';
  private static studentSurname2 = 'Lopez';
  private static studentEmail = 'juan@test.org';
  private static universaeEmail = 'juan.ros@universae.com';

  public static academicRecordId = 'a4d5dfb8-9609-444c-9d5e-7d05bf6d4df7';

  public static enrollmentId = 'd3087949-3d62-4eaf-a179-c569d02b6ee6';

  public static internalGroupId = uuid();

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
  private otherSubject: Subject;
  private internalGroup: InternalGroup;

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
  private internalGroupRepository: Repository<InternalGroup>;

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
    this.internalGroupRepository =
      datasource.getRepository(internalGroupSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      CreateEnrollmentE2eSeed.businessUnitId,
      CreateEnrollmentE2eSeed.businessUnitName,
      CreateEnrollmentE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.create(
      CreateEnrollmentE2eSeed.virtualCampusId,
      CreateEnrollmentE2eSeed.virtualCampusName,
      CreateEnrollmentE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateEnrollmentE2eSeed.superAdminUserId,
      CreateEnrollmentE2eSeed.superAdminUserEmail,
      CreateEnrollmentE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateEnrollmentE2eSeed.adminUserId,
      CreateEnrollmentE2eSeed.adminUserEmail,
      CreateEnrollmentE2eSeed.adminUserPassword,
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
      CreateEnrollmentE2eSeed.academicProgramId,
      CreateEnrollmentE2eSeed.academicProgramName,
      CreateEnrollmentE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      CreateEnrollmentE2eSeed.academicPeriodId,
      CreateEnrollmentE2eSeed.academicPeriodName,
      CreateEnrollmentE2eSeed.academicPeriodCode,
      new Date(CreateEnrollmentE2eSeed.academicPeriodStartDate),
      new Date(CreateEnrollmentE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      CreateEnrollmentE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      CreateEnrollmentE2eSeed.programBlockId,
      CreateEnrollmentE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: CreateEnrollmentE2eSeed.subjectEvaluationType,
    });
    this.subject = Subject.create(
      CreateEnrollmentE2eSeed.subjectId,
      null,
      CreateEnrollmentE2eSeed.subjectName,
      CreateEnrollmentE2eSeed.subjectCode,
      null,
      CreateEnrollmentE2eSeed.subjectHours,
      CreateEnrollmentE2eSeed.subjectModality,
      evaluationType,
      CreateEnrollmentE2eSeed.subjectType,
      this.businessUnit,
      CreateEnrollmentE2eSeed.subjectIsRegulated,
      CreateEnrollmentE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    this.subject.lmsCourse = getALmsCourse(5606, 'Test');
    await this.subjectRepository.save(this.subject);

    this.otherSubject = Subject.create(
      CreateEnrollmentE2eSeed.otherSubjectId,
      null,
      CreateEnrollmentE2eSeed.otherSubjectName,
      CreateEnrollmentE2eSeed.otherSubjectCode,
      null,
      CreateEnrollmentE2eSeed.subjectHours,
      CreateEnrollmentE2eSeed.subjectModality,
      evaluationType,
      CreateEnrollmentE2eSeed.subjectType,
      this.businessUnit,
      CreateEnrollmentE2eSeed.subjectIsRegulated,
      CreateEnrollmentE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    this.otherSubject.lmsCourse = getALmsCourse(5606, 'Test');
    await this.subjectRepository.save(this.otherSubject);

    this.programBlock.addSubject(this.subject, this.superAdminUser);
    this.programBlock.addSubject(this.otherSubject, this.superAdminUser);
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];

    this.student = Student.createFromSGA(
      CreateEnrollmentE2eSeed.studentId,
      CreateEnrollmentE2eSeed.studentName,
      CreateEnrollmentE2eSeed.studentSurname,
      CreateEnrollmentE2eSeed.studentSurname2,
      CreateEnrollmentE2eSeed.studentEmail,
      CreateEnrollmentE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
      null,
    );
    this.student.lmsStudent = getALmsStudent(8389);
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      CreateEnrollmentE2eSeed.academicRecordId,
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

    await this.internalGroupRepository.save(
      InternalGroup.create(
        CreateEnrollmentE2eSeed.internalGroupId,
        'intgrocod',
        [],
        [],
        this.academicPeriod,
        this.academicProgram,
        this.academicPeriod.periodBlocks[0],
        this.otherSubject,
        this.businessUnit,
        true,
        this.superAdminUser,
        null,
      ),
    );
  }

  async clear(): Promise<void> {
    this.internalGroupRepository.delete({});
    await this.subjectCallRepository.delete({});
    await this.enrollmentRepository.delete(
      CreateEnrollmentE2eSeed.enrollmentId,
    );
    await this.academicRecordRepository.delete(
      CreateEnrollmentE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete({});
    await this.subjectRepository.delete({});
    await this.programBlockRepository.delete({});
    await this.academicRecordRepository.delete(
      CreateEnrollmentE2eSeed.academicRecordId,
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
