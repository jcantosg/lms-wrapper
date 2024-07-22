import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { chatroomSchema } from '#shared/infrastructure/config/schema/chatroom.schema';

export class ChatsE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static studentUniversaeEmail = 'juan.ros@universae.com';
  public static studentPassword = 'pass123';

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static virtualCampusId = uuid();
  public static virtualCampusName = 'Campus virtual de Madrid';
  public static virtualCampusCode = 'CVM';

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2035';
  public static academicPeriodCode = 'MAD-2023-2035';
  public static academicPeriodStartDate = '2022-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 1;

  public static titleId = uuid();
  public static titleName = 'Ingenieria informatica';
  public static titleOfficialCode = 'II';
  public static titleOfficialTitle = 'Ingeniero informatico';
  public static titleOfficialProgram = 'Ingenieria informatica';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static subjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  private static subjectHours = 32;
  private static subjectModality = SubjectModality.PRESENCIAL;
  private static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  private static subjectType = SubjectType.SUBJECT;
  private static subjectIsRegulated = false;
  private static subjectIsCore = true;

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 0';

  public static periodBlockId = uuid();
  public static periodBlockName = 'Bloque 0';
  public static blockRelationId = uuid();

  public static academicRecordId = uuid();
  public static academicRecordIsModular = false;

  public static enrollmentId = uuid();

  public static edaeUserId = '9f344508-cec9-4472-aa35-531a4d76343d';
  public static edaeUserName = 'teacher';
  public static edaeUserSurname = 'Surname';
  public static edaeUserEmail = 'edae-user@universae.com';
  public static edaeUserPassword = 'password';

  public static internalGroupId = uuid();
  public static internalGroupCode = 'code';

  public static chatroomId = uuid();

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private subject: Subject;
  private programBlock: ProgramBlock;
  private periodBlock: PeriodBlock;
  private student: Student;
  private title: Title;
  private academicRecord: AcademicRecord;
  private enrollment: Enrollment;
  private internalGroup: InternalGroup;
  private edaeUser: EdaeUser;
  private chatroom: Chatroom;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private subjectRepository: Repository<Subject>;
  private programBlockRepository: Repository<ProgramBlock>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private periodBlockRepository: Repository<PeriodBlock>;
  private internalGroupRepository: Repository<InternalGroup>;
  private blockRelationRepository: Repository<BlockRelation>;
  private enrollmentRepository: Repository<Enrollment>;
  private edaeUserRepository: Repository<EdaeUser>;
  private chatroomRepository: Repository<Chatroom>;

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
    this.periodBlockRepository = datasource.getRepository(periodBlockSchema);
    this.internalGroupRepository =
      datasource.getRepository(internalGroupSchema);
    this.blockRelationRepository =
      datasource.getRepository(blockRelationSchema);
    this.enrollmentRepository = datasource.getRepository(enrollmentSchema);
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
    this.chatroomRepository = datasource.getRepository(chatroomSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      ChatsE2eSeed.businessUnitId,
      ChatsE2eSeed.businessUnitName,
      ChatsE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.create(
      ChatsE2eSeed.virtualCampusId,
      ChatsE2eSeed.virtualCampusName,
      ChatsE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      ChatsE2eSeed.superAdminUserId,
      ChatsE2eSeed.superAdminUserEmail,
      ChatsE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = Title.create(
      ChatsE2eSeed.titleId,
      ChatsE2eSeed.titleName,
      ChatsE2eSeed.titleOfficialCode,
      ChatsE2eSeed.titleOfficialTitle,
      ChatsE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: ChatsE2eSeed.subjectEvaluationType,
    });

    this.subject = Subject.create(
      ChatsE2eSeed.subjectId,
      null,
      ChatsE2eSeed.subjectName,
      ChatsE2eSeed.subjectCode,
      null,
      ChatsE2eSeed.subjectHours,
      ChatsE2eSeed.subjectModality,
      evaluationType,
      ChatsE2eSeed.subjectType,
      this.businessUnit,
      ChatsE2eSeed.subjectIsRegulated,
      ChatsE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);

    this.academicProgram = AcademicProgram.create(
      ChatsE2eSeed.academicProgramId,
      ChatsE2eSeed.academicProgramName,
      ChatsE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    this.programBlock = ProgramBlock.create(
      ChatsE2eSeed.programBlockId,
      ChatsE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    this.programBlock.addSubject(this.subject, this.superAdminUser);
    this.academicProgram.programBlocks = [this.programBlock];

    await this.academicProgramRepository.save(this.academicProgram);
    await this.programBlockRepository.save(this.programBlock);

    this.academicPeriod = AcademicPeriod.create(
      ChatsE2eSeed.academicPeriodId,
      ChatsE2eSeed.academicPeriodName,
      ChatsE2eSeed.academicPeriodCode,
      new Date(ChatsE2eSeed.academicPeriodStartDate),
      new Date(ChatsE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      ChatsE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);

    this.periodBlock = PeriodBlock.create(
      ChatsE2eSeed.periodBlockId,
      this.academicPeriod,
      ChatsE2eSeed.name,
      this.academicPeriod.startDate,
      this.academicPeriod.endDate,
      this.superAdminUser,
    );
    this.academicPeriod.periodBlocks = [this.periodBlock];
    await this.academicPeriodRepository.save(this.academicPeriod);
    await this.periodBlockRepository.save(this.periodBlock);

    await this.blockRelationRepository.save(
      BlockRelation.create(
        ChatsE2eSeed.blockRelationId,
        this.periodBlock,
        this.programBlock,
        this.superAdminUser,
      ),
    );

    await this.academicProgramRepository.save({
      id: this.academicProgram.id,
      programBlocks: this.academicProgram.programBlocks,
    });

    const passwordEncoder = new BCryptPasswordEncoder();

    this.student = Student.createFromSGA(
      ChatsE2eSeed.studentId,
      ChatsE2eSeed.studentName,
      ChatsE2eSeed.studentSurname,
      ChatsE2eSeed.studentSurname2,
      ChatsE2eSeed.studentEmail,
      ChatsE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(ChatsE2eSeed.studentPassword),
      null,
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      ChatsE2eSeed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      ChatsE2eSeed.academicRecordIsModular,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.academicRecord);

    this.enrollment = Enrollment.create(
      ChatsE2eSeed.enrollmentId,
      this.subject,
      this.academicRecord,
      EnrollmentVisibilityEnum.YES,
      EnrollmentTypeEnum.UNIVERSAE,
      this.programBlock,
      this.superAdminUser,
    );
    await this.enrollmentRepository.save(this.enrollment);

    this.edaeUser = EdaeUser.create(
      ChatsE2eSeed.edaeUserId,
      ChatsE2eSeed.edaeUserName,
      ChatsE2eSeed.edaeUserSurname,
      null,
      ChatsE2eSeed.edaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE],
      [this.businessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
      await passwordEncoder.encodePassword(ChatsE2eSeed.edaeUserPassword),
    );

    await this.edaeUserRepository.save(this.edaeUser);

    this.internalGroup = InternalGroup.create(
      ChatsE2eSeed.internalGroupId,
      ChatsE2eSeed.internalGroupCode,
      [this.student],
      [this.edaeUser],
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

    this.chatroom = Chatroom.create(
      ChatsE2eSeed.chatroomId,
      this.internalGroup,
      this.student,
      this.edaeUser,
    );
    await this.chatroomRepository.save(this.chatroom);
  }

  async clear(): Promise<void> {
    await this.chatroomRepository.delete({});
    await this.internalGroupRepository.delete({});
    await this.enrollmentRepository.delete({});
    await this.academicRecordRepository.delete(ChatsE2eSeed.academicRecordId);
    await this.studentRepository.delete(this.student.id);
    await this.blockRelationRepository.delete({});
    await this.periodBlockRepository.delete({});
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
