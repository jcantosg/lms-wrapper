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
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessFile } from '#student/domain/entity/administrative-process-file';
import { administrativeProcessSchema } from '#student/infrastructure/config/schema/administrative-process.schema';

export class GetStudentAdministrativeProcessesE2eSeed implements E2eSeed {
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

  public static identityDocumentAdministrativeProcessId = uuid();
  public static photoAdministrativeProcessId = uuid();
  public static newAcademicRecordAdministrativeProcessId = uuid();
  public static accessDocumentAdministrativeProcessId = uuid();

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private student: Student;
  private title: Title;
  private academicRecord: AcademicRecord;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private administrativeProcessRepository: Repository<AdministrativeProcess>;

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
    this.administrativeProcessRepository = datasource.getRepository(
      administrativeProcessSchema,
    );
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      GetStudentAdministrativeProcessesE2eSeed.businessUnitId,
      GetStudentAdministrativeProcessesE2eSeed.businessUnitName,
      GetStudentAdministrativeProcessesE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.create(
      GetStudentAdministrativeProcessesE2eSeed.virtualCampusId,
      GetStudentAdministrativeProcessesE2eSeed.virtualCampusName,
      GetStudentAdministrativeProcessesE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetStudentAdministrativeProcessesE2eSeed.superAdminUserId,
      GetStudentAdministrativeProcessesE2eSeed.superAdminUserEmail,
      GetStudentAdministrativeProcessesE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.title = Title.create(
      GetStudentAdministrativeProcessesE2eSeed.titleId,
      GetStudentAdministrativeProcessesE2eSeed.titleName,
      GetStudentAdministrativeProcessesE2eSeed.titleOfficialCode,
      GetStudentAdministrativeProcessesE2eSeed.titleOfficialTitle,
      GetStudentAdministrativeProcessesE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      GetStudentAdministrativeProcessesE2eSeed.academicProgramId,
      GetStudentAdministrativeProcessesE2eSeed.academicProgramName,
      GetStudentAdministrativeProcessesE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      GetStudentAdministrativeProcessesE2eSeed.academicPeriodId,
      GetStudentAdministrativeProcessesE2eSeed.academicPeriodName,
      GetStudentAdministrativeProcessesE2eSeed.academicPeriodCode,
      new Date(
        GetStudentAdministrativeProcessesE2eSeed.academicPeriodStartDate,
      ),
      new Date(GetStudentAdministrativeProcessesE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      GetStudentAdministrativeProcessesE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      GetStudentAdministrativeProcessesE2eSeed.programBlockId,
      GetStudentAdministrativeProcessesE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];
    const passwordEncoder = new BCryptPasswordEncoder();

    this.student = Student.createFromSGA(
      GetStudentAdministrativeProcessesE2eSeed.studentId,
      GetStudentAdministrativeProcessesE2eSeed.studentName,
      GetStudentAdministrativeProcessesE2eSeed.studentSurname,
      GetStudentAdministrativeProcessesE2eSeed.studentSurname2,
      GetStudentAdministrativeProcessesE2eSeed.studentEmail,
      GetStudentAdministrativeProcessesE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
      await passwordEncoder.encodePassword(
        GetStudentAdministrativeProcessesE2eSeed.studentPassword,
      ),
      null,
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      GetStudentAdministrativeProcessesE2eSeed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      GetStudentAdministrativeProcessesE2eSeed.academicRecordIsModular,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.academicRecord);

    const identityDocumentAdminProcess = AdministrativeProcess.create(
      GetStudentAdministrativeProcessesE2eSeed.identityDocumentAdministrativeProcessId,
      AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
      this.student,
      null,
      this.businessUnit,
    );
    identityDocumentAdminProcess.addFile(
      new AdministrativeProcessFile({
        documentType: AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
        mimeType: 'jpg',
        name: 'dni-frente.jpg',
        size: 123,
        url: 'https://tolentinoabogados.com/wp-content/uploads/2014/04/dni-e1618306841277.jpg',
      }),
    );
    identityDocumentAdminProcess.addFile(
      new AdministrativeProcessFile({
        documentType: AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
        mimeType: 'jpg',
        name: 'dni-reverso.jpg',
        size: 125,
        url: 'https://phantom-elmundo.unidadeditorial.es/2942a626cf35283b77b582ff0ea6aa46/resize/828/f/jpg/assets/multimedia/imagenes/2021/06/04/16228037055335.jpg',
      }),
    );
    const photoAdminProcess = AdministrativeProcess.create(
      GetStudentAdministrativeProcessesE2eSeed.photoAdministrativeProcessId,
      AdministrativeProcessTypeEnum.PHOTO,
      this.student,
      null,
      this.businessUnit,
    );
    photoAdminProcess.addFile(
      new AdministrativeProcessFile({
        documentType: AdministrativeProcessTypeEnum.PHOTO,
        mimeType: 'jpg',
        name: 'foto.jpg',
        size: 121,
        url: 'https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg',
      }),
    );
    const newAcademicRecordAdministrativeProcess = AdministrativeProcess.create(
      GetStudentAdministrativeProcessesE2eSeed.newAcademicRecordAdministrativeProcessId,
      AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
      this.student,
      this.academicRecord,
      this.businessUnit,
    );
    const accessDocumentAdministrativeProcess = AdministrativeProcess.create(
      GetStudentAdministrativeProcessesE2eSeed.accessDocumentAdministrativeProcessId,
      AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
      this.student,
      this.academicRecord,
      this.businessUnit,
    );
    accessDocumentAdministrativeProcess.addFile(
      new AdministrativeProcessFile({
        documentType: AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
        mimeType: 'jpg',
        name: 'document-de-acceso.jpg',
        size: 111,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Documento_Espa%C3%B1ol.jpg/347px-Documento_Espa%C3%B1ol.jpg',
      }),
    );

    await this.administrativeProcessRepository.save([
      identityDocumentAdminProcess,
      photoAdminProcess,
      newAcademicRecordAdministrativeProcess,
      accessDocumentAdministrativeProcess,
    ]);
  }

  async clear(): Promise<void> {
    await this.administrativeProcessRepository.delete({});
    await this.academicRecordRepository.delete(
      GetStudentAdministrativeProcessesE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
