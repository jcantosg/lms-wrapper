import { DataSource, Repository } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { Student } from '#student/domain/entity/student.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export class CreateAcademicRecordE2eSeed implements E2eSeed {
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

  public static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc72';
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  public static virtualCampusId = uuid();
  public static virtualCampusName = 'Campus virtual de Madrid';
  public static virtualCampusCode = 'CVM';

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

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private student: Student;
  private title: Title;

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
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.titleRepository = datasource.getRepository(Title);
    this.programBlockRepository = datasource.getRepository(ProgramBlock);
    this.studentRepository = datasource.getRepository(Student);
    this.virtualCampusRepository = datasource.getRepository(VirtualCampus);
    this.academicRecordRepository = datasource.getRepository(AcademicRecord);
  }

  async arrange() {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      CreateAcademicRecordE2eSeed.businessUnitId,
      CreateAcademicRecordE2eSeed.businessUnitName,
      CreateAcademicRecordE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.create(
      CreateAcademicRecordE2eSeed.virtualCampusId,
      CreateAcademicRecordE2eSeed.virtualCampusName,
      CreateAcademicRecordE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateAcademicRecordE2eSeed.superAdminUserId,
      CreateAcademicRecordE2eSeed.superAdminUserEmail,
      CreateAcademicRecordE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      CreateAcademicRecordE2eSeed.adminUserId,
      CreateAcademicRecordE2eSeed.adminUserEmail,
      CreateAcademicRecordE2eSeed.adminUserPassword,
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
      CreateAcademicRecordE2eSeed.academicProgramId,
      CreateAcademicRecordE2eSeed.academicProgramName,
      CreateAcademicRecordE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      CreateAcademicRecordE2eSeed.academicPeriodId,
      CreateAcademicRecordE2eSeed.academicPeriodName,
      CreateAcademicRecordE2eSeed.academicPeriodCode,
      new Date(CreateAcademicRecordE2eSeed.academicPeriodStartDate),
      new Date(CreateAcademicRecordE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      CreateAcademicRecordE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.programBlock = ProgramBlock.create(
      CreateAcademicRecordE2eSeed.programBlockId,
      CreateAcademicRecordE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
    this.academicProgram.programBlocks = [this.programBlock];

    this.student = Student.createFromSGA(
      CreateAcademicRecordE2eSeed.studentId,
      CreateAcademicRecordE2eSeed.studentName,
      CreateAcademicRecordE2eSeed.studentSurname,
      CreateAcademicRecordE2eSeed.studentSurname2,
      CreateAcademicRecordE2eSeed.studentEmail,
      CreateAcademicRecordE2eSeed.universaeEmail,
      this.superAdminUser,
    );
    await this.studentRepository.save(this.student);
  }

  async clear() {
    await this.academicRecordRepository.delete(
      CreateAcademicRecordE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(this.student.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
