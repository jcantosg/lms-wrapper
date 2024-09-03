import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { Student } from '#shared/domain/entity/student.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { Communication } from '#shared/domain/entity/communication.entity';
import { CommunicationSchema } from '#shared/infrastructure/config/schema/communication.schema';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { Message } from '#shared/domain/value-object/message.value-object';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';
import { CommunicationStudentSchema } from '#shared/infrastructure/config/schema/communication-student.schema';

export class GetStudentCommunicationsE2eSeed implements E2eSeed {
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

  public static titleId = uuid();
  public static titleName = 'Ingenieria informatica';
  public static titleOfficialCode = 'II';
  public static titleOfficialTitle = 'Ingeniero informatico';
  public static titleOfficialProgram = 'Ingenieria informatica';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static studentUniversaeEmail = 'juan.ros@universae.com';
  public static studentPassword = 'pass123';

  public static communicationId = uuid();
  public static communicationSubject = 'subject';
  public static communicationShortDescription = 'short description';
  public static communicationBody = 'body';

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private student: Student;
  private title: Title;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private studentRepository: Repository<Student>;
  private communicationRepository: Repository<Communication>;
  private communicationStudentRepository: Repository<CommunicationStudent>;

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
    this.communicationRepository =
      datasource.getRepository(CommunicationSchema);
    this.communicationStudentRepository = datasource.getRepository(
      CommunicationStudentSchema,
    );
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      GetStudentCommunicationsE2eSeed.businessUnitId,
      GetStudentCommunicationsE2eSeed.businessUnitName,
      GetStudentCommunicationsE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetStudentCommunicationsE2eSeed.superAdminUserId,
      GetStudentCommunicationsE2eSeed.superAdminUserEmail,
      GetStudentCommunicationsE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = Title.create(
      GetStudentCommunicationsE2eSeed.titleId,
      GetStudentCommunicationsE2eSeed.titleName,
      GetStudentCommunicationsE2eSeed.titleOfficialCode,
      GetStudentCommunicationsE2eSeed.titleOfficialTitle,
      GetStudentCommunicationsE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      GetStudentCommunicationsE2eSeed.academicProgramId,
      GetStudentCommunicationsE2eSeed.academicProgramName,
      GetStudentCommunicationsE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      GetStudentCommunicationsE2eSeed.academicPeriodId,
      GetStudentCommunicationsE2eSeed.academicPeriodName,
      GetStudentCommunicationsE2eSeed.academicPeriodCode,
      new Date(GetStudentCommunicationsE2eSeed.academicPeriodStartDate),
      new Date(GetStudentCommunicationsE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      GetStudentCommunicationsE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      uuid(),
      'bloque 1',
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];
    const passwordEncoder = new BCryptPasswordEncoder();

    this.student = Student.createFromSGA(
      GetStudentCommunicationsE2eSeed.studentId,
      GetStudentCommunicationsE2eSeed.studentName,
      GetStudentCommunicationsE2eSeed.studentSurname,
      GetStudentCommunicationsE2eSeed.studentSurname2,
      GetStudentCommunicationsE2eSeed.studentEmail,
      GetStudentCommunicationsE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(
        GetStudentCommunicationsE2eSeed.studentPassword,
      ),
      null,
    );
    await this.studentRepository.save(this.student);

    const communication = Communication.create(
      GetStudentCommunicationsE2eSeed.communicationId,
      this.superAdminUser,
      [this.businessUnit],
      [this.academicPeriod],
      [this.title],
      [this.academicProgram],
      [],
      true,
      true,
      CommunicationStatus.DRAFT,
      new Message({
        subject: GetStudentCommunicationsE2eSeed.communicationSubject,
        shortDescription:
          GetStudentCommunicationsE2eSeed.communicationShortDescription,
        body: GetStudentCommunicationsE2eSeed.communicationBody,
      }),
      [],
    );
    const communicationStudent = CommunicationStudent.create(
      uuid(),
      communication,
      this.student,
      false,
      false,
    );

    communication.updateStatus(CommunicationStatus.SENT, this.superAdminUser);

    await this.communicationRepository.save(communication);
    await this.communicationStudentRepository.save(communicationStudent);
  }

  async clear(): Promise<void> {
    await this.communicationStudentRepository.delete({});
    await this.communicationRepository.delete({});
    await this.studentRepository.delete(this.student.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
