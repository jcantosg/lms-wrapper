import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { Student } from '#shared/domain/entity/student.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';

export class RemoveSpecialtyfromAcademicProgramE2eSeed implements E2eSeed {
  public static superAdminUserId = 'd97ec108-5c63-44be-93d1-59c48e64c24b';
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';

  public static adminUserId = 'c75e34b9-a7ce-4624-9c07-0cde40b7e688';
  public static adminUserEmail = 'secretaria@universae.com';
  public static adminUserPassword = 'pass123';

  public static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc71';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static titleId = '8a3b7f11-6c4e-4457-b78c-e07c4836be70';
  public static titleName = 'Grado En Desarrollo Web';
  public static titleCode = 'DAW2023';
  public static titleProgram = 'BOE-12123';

  public static academicProgramId = '61c97fd0-8a83-43e0-9138-b77bdf377c57';
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static subjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 32;
  public static subjectModality = SubjectModality.PRESENCIAL;
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  public static specialtyId = '2b864bff-7c46-4212-8e1d-4ea7acf38ca2';
  public static specialtyName = 'Programación Orientada a Objetosn 2';
  public static specialtyCode = 'UniversaePOO2';
  public static specialtyHours = 32;
  public static specialtyModality = SubjectModality.ELEARNING;
  public static specialtyType = SubjectType.SPECIALTY;
  public static specialtyIsRegulated = false;
  public static specialtyIsCore = false;

  public static enrollmentId = '2b864bff-7c46-4212-8e1d-4ea7acf38c44';

  public static specialtyWithEnrollmentId =
    '2b864bff-7c46-4212-8e1d-4ea7acf38ca3';
  public static specialtyWithEnrollmentName =
    'Programación Orientada a Objetosn 3';
  public static specialtyWithEnrollmentCode = 'UniversaePOO3';
  public static specialtyWithEnrollmentHours = 32;
  public static specialtyWithEnrollmentModality = SubjectModality.ELEARNING;
  public static specialtyWithEnrollmentType = SubjectType.SPECIALTY;
  public static specialtyWithEnrollmentIsRegulated = false;
  public static specialtyWithEnrollmentIsCore = false;

  public static programBlockId = '0812a90f-0e59-4a8e-9187-06ec1bb1e296';
  public static programBlockName = 'Bloque 1';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;
  private subject: Subject;
  private specialty: Subject;
  private specialtyWithEnrollment: Subject;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private enrollment: Enrollment;
  private student: Student;
  private academicRecord: AcademicRecord;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;

  private countryRepository: Repository<Country>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private titleRepository: Repository<Title>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private subjectRepository: Repository<Subject>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private programBlockRepository: Repository<ProgramBlock>;
  private enrollmentRepository: Repository<Enrollment>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private academicPeriodRepository: Repository<AcademicPeriod>;
  private virtualCampusRepository: Repository<VirtualCampus>;

  constructor(private readonly datasource: DataSource) {
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.titleRepository = datasource.getRepository(titleSchema);
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.academicProgramRepository = datasource.getRepository(
      academicProgramSchema,
    );
    this.programBlockRepository = datasource.getRepository(programBlockSchema);
    this.enrollmentRepository = datasource.getRepository(enrollmentSchema);
    this.academicRecordRepository =
      datasource.getRepository(academicRecordSchema);
    this.studentRepository = datasource.getRepository(studentSchema);
    this.academicPeriodRepository =
      datasource.getRepository(academicPeriodSchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
  }

  async arrange() {
    const country = await this.countryRepository.findOneByOrFail({ iso: 'ES' });
    this.businessUnit = BusinessUnit.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.businessUnitId,
      RemoveSpecialtyfromAcademicProgramE2eSeed.businessUnitName,
      RemoveSpecialtyfromAcademicProgramE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveSpecialtyfromAcademicProgramE2eSeed.superAdminUserId,
      RemoveSpecialtyfromAcademicProgramE2eSeed.superAdminUserEmail,
      RemoveSpecialtyfromAcademicProgramE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      RemoveSpecialtyfromAcademicProgramE2eSeed.adminUserId,
      RemoveSpecialtyfromAcademicProgramE2eSeed.adminUserEmail,
      RemoveSpecialtyfromAcademicProgramE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
      [this.businessUnit],
    );
    this.title = Title.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.titleId,
      RemoveSpecialtyfromAcademicProgramE2eSeed.titleName,
      null,
      RemoveSpecialtyfromAcademicProgramE2eSeed.titleCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.titleProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      name: 'Proyecto',
    });
    const evaluationTypeNoEv =
      await this.evaluationTypeRepository.findOneByOrFail({
        name: 'No Evaluable',
      });
    this.subject = Subject.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectId,
      null,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectName,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectHours,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectModality,
      evaluationType,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectType,
      this.businessUnit,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectIsRegulated,
      RemoveSpecialtyfromAcademicProgramE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    this.specialty = Subject.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyId,
      null,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyName,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyHours,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyModality,
      evaluationTypeNoEv,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyType,
      this.businessUnit,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyIsRegulated,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyIsCore,
      this.superAdminUser,
      null,
    );
    this.specialtyWithEnrollment = Subject.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentId,
      null,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentName,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentCode,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentHours,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentModality,
      evaluationTypeNoEv,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentType,
      this.businessUnit,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentIsRegulated,
      RemoveSpecialtyfromAcademicProgramE2eSeed.specialtyWithEnrollmentIsCore,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);
    await this.subjectRepository.save(this.specialty);
    await this.subjectRepository.save(this.specialtyWithEnrollment);
    this.academicProgram = AcademicProgram.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.academicProgramId,
      RemoveSpecialtyfromAcademicProgramE2eSeed.academicProgramName,
      RemoveSpecialtyfromAcademicProgramE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.SEMESTER,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.programBlock = ProgramBlock.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.programBlockId,
      RemoveSpecialtyfromAcademicProgramE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    this.programBlock.subjects = [
      this.subject,
      this.specialty,
      this.specialtyWithEnrollment,
    ];
    await this.programBlockRepository.save(this.programBlock);

    this.student = Student.createFromSGA(
      '3b864bff-7c46-4212-8e1d-4ea7acf38ca2',
      'Pepe',
      'Perez',
      'Gomez',
      'pepe@gmail.com',
      'pepe@universae.com',
      this.superAdminUser,
      'test123',
      null,
    );
    await this.studentRepository.save(this.student);

    this.virtualCampus = VirtualCampus.create(
      '3b864bff-7c46-4212-8e1d-4ea7acf38c88',
      'campus test',
      'test',
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.academicPeriod = AcademicPeriod.create(
      '3b864bff-7c46-4212-8e1d-4ea7acf38c99',
      'period test',
      'test',
      new Date(),
      new Date(),
      this.businessUnit,
      1,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.academicRecord = AcademicRecord.create(
      '3b864bff-7c46-4212-8e1d-4ea7acf38c87',
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      true,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.academicRecord);

    this.enrollment = Enrollment.create(
      RemoveSpecialtyfromAcademicProgramE2eSeed.enrollmentId,
      this.specialtyWithEnrollment,
      this.academicRecord,
      EnrollmentVisibilityEnum.PD,
      EnrollmentTypeEnum.UNIVERSAE,
      this.programBlock,
      this.superAdminUser,
    );
    await this.enrollmentRepository.save(this.enrollment);
  }

  async clear() {
    await this.enrollmentRepository.delete(this.enrollment.id);
    await this.academicRecordRepository.delete(this.academicRecord.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.studentRepository.delete(this.student.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.subjectRepository.delete(this.specialty.id);
    await this.subjectRepository.delete(this.specialtyWithEnrollment.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
