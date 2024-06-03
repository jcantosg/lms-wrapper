import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
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
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';

export class EditAcademicRecordE2eSeed implements E2eSeed {
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
  public static programBlockName = 'Bloque 1';

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static universaeEmail = 'juan.ros@universae.com';

  public static academicRecordId = uuid();
  public static academicRecordIsModular = false;

  private superAdminUser: AdminUser;
  private adminUserSecretaria: AdminUser;
  private adminUserGestor360: AdminUser;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
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
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      EditAcademicRecordE2eSeed.businessUnitId,
      EditAcademicRecordE2eSeed.businessUnitName,
      EditAcademicRecordE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      EditAcademicRecordE2eSeed.secondBusinessUnitId,
      EditAcademicRecordE2eSeed.secondBusinessUnitName,
      EditAcademicRecordE2eSeed.secondBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.virtualCampus = VirtualCampus.create(
      EditAcademicRecordE2eSeed.virtualCampusId,
      EditAcademicRecordE2eSeed.virtualCampusName,
      EditAcademicRecordE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditAcademicRecordE2eSeed.superAdminUserId,
      EditAcademicRecordE2eSeed.superAdminUserEmail,
      EditAcademicRecordE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUserSecretaria = await createAdminUser(
      this.datasource,
      EditAcademicRecordE2eSeed.adminUserSecretariaId,
      EditAcademicRecordE2eSeed.adminUserSecretariaEmail,
      EditAcademicRecordE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.secondBusinessUnit],
    );

    this.adminUserGestor360 = await createAdminUser(
      this.datasource,
      EditAcademicRecordE2eSeed.adminUserGestor360Id,
      EditAcademicRecordE2eSeed.adminUserGestor360Email,
      EditAcademicRecordE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.title = Title.create(
      EditAcademicRecordE2eSeed.titleId,
      EditAcademicRecordE2eSeed.titleName,
      EditAcademicRecordE2eSeed.titleOfficialCode,
      EditAcademicRecordE2eSeed.titleOfficialTitle,
      EditAcademicRecordE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.academicProgram = AcademicProgram.create(
      EditAcademicRecordE2eSeed.academicProgramId,
      EditAcademicRecordE2eSeed.academicProgramName,
      EditAcademicRecordE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      EditAcademicRecordE2eSeed.academicPeriodId,
      EditAcademicRecordE2eSeed.academicPeriodName,
      EditAcademicRecordE2eSeed.academicPeriodCode,
      new Date(EditAcademicRecordE2eSeed.academicPeriodStartDate),
      new Date(EditAcademicRecordE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      EditAcademicRecordE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      EditAcademicRecordE2eSeed.programBlockId,
      EditAcademicRecordE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];

    this.student = Student.createFromSGA(
      EditAcademicRecordE2eSeed.studentId,
      EditAcademicRecordE2eSeed.studentName,
      EditAcademicRecordE2eSeed.studentSurname,
      EditAcademicRecordE2eSeed.studentSurname2,
      EditAcademicRecordE2eSeed.studentEmail,
      EditAcademicRecordE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
    );
    await this.studentRepository.save(this.student);

    this.academicRecord = AcademicRecord.create(
      EditAcademicRecordE2eSeed.academicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      EditAcademicRecordE2eSeed.academicRecordIsModular,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.academicRecord);
  }

  async clear(): Promise<void> {
    await this.academicRecordRepository.delete(
      EditAcademicRecordE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.programBlockRepository.delete(this.programBlock.id);
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
