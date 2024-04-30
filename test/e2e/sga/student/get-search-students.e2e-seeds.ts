import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { Student } from '#student/domain/entity/student.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicRecord } from '#academic-offering/domain/entity/academic-record.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicRecordModalityEnum } from '#academic-offering/domain/enum/academic-record-modality.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export class GetSearchStudentsE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-get-search-students@universae.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static studentUniversaeEmail = 'juan.ros@universae.com';

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static virtualCampusId = '1847be5e-693f-4a7d-9f66-00faed159c0c';
  public static virtualCampusName = 'Murcia';
  public static virtualCampusCode = 'MUR';

  public static titleId = '10516686-357c-4c5d-8d09-34a29f8d8121';
  public static titleName = 'Aplicaciones Web';
  public static titleOfficialCode = 'DAW14';
  public static titleOfficialTitle = 'DOR 12';
  public static titleOfficialProgram = 'Real Decreto 10/23';

  public static academicPeriodId = '7baf9fc5-8976-4780-aa07-c0dfb420e230';
  public static academicPeriodName = '2023/2024';
  public static academicPeriodCode = 'MUR2023/24';

  public static academicProgramId = '7158c476-b422-4f3d-817e-17290db6e76a';
  public static academicProgramName = 'Desarrollo Web';
  public static academicProgramCode = 'DAW';

  public static programBlockId = '0812a90f-0e59-4a8e-9187-06ec1bb1e296';
  public static programBlockName = 'Bloque 1';

  public static academicRecordId = '901764bc-9b3b-493b-81d5-c6cefb13d16d';

  private superAdminUser: AdminUser;

  private countryRepository: Repository<Country>;

  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private titleRepository: Repository<Title>;
  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private programBlockRepository: Repository<ProgramBlock>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;

  constructor(private datasource: DataSource) {
    this.countryRepository = datasource.getRepository(Country);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.virtualCampusRepository = datasource.getRepository(VirtualCampus);
    this.titleRepository = datasource.getRepository(Title);
    this.academicPeriodRepository = datasource.getRepository(AcademicPeriod);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.programBlockRepository = datasource.getRepository(ProgramBlock);
    this.studentRepository = datasource.getRepository(Student);
    this.academicRecordRepository = datasource.getRepository(AcademicRecord);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({ iso: 'ES' });
    const businessUnit = BusinessUnit.create(
      GetSearchStudentsE2eSeed.businessUnitId,
      GetSearchStudentsE2eSeed.businessUnitName,
      GetSearchStudentsE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetSearchStudentsE2eSeed.superAdminUserId,
      GetSearchStudentsE2eSeed.superAdminUserEmail,
      GetSearchStudentsE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [businessUnit],
    );
    const virtualCampus = VirtualCampus.create(
      GetSearchStudentsE2eSeed.virtualCampusId,
      GetSearchStudentsE2eSeed.virtualCampusName,
      GetSearchStudentsE2eSeed.virtualCampusCode,
      businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(virtualCampus);
    const title = Title.create(
      GetSearchStudentsE2eSeed.titleId,
      GetSearchStudentsE2eSeed.titleName,
      GetSearchStudentsE2eSeed.titleOfficialCode,
      GetSearchStudentsE2eSeed.titleOfficialProgram,
      GetSearchStudentsE2eSeed.titleOfficialTitle,
      businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(title);
    const academicProgram = AcademicProgram.create(
      GetSearchStudentsE2eSeed.academicProgramId,
      GetSearchStudentsE2eSeed.academicProgramName,
      GetSearchStudentsE2eSeed.academicProgramCode,
      title,
      businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.SEMESTER,
    );
    const programBlock = ProgramBlock.create(
      GetSearchStudentsE2eSeed.programBlockId,
      GetSearchStudentsE2eSeed.programBlockName,
      academicProgram,
      this.superAdminUser,
    );
    academicProgram.programBlocks.push(programBlock);
    await this.academicProgramRepository.save(academicProgram);
    const academicPeriod = AcademicPeriod.create(
      GetSearchStudentsE2eSeed.academicPeriodId,
      GetSearchStudentsE2eSeed.academicPeriodName,
      GetSearchStudentsE2eSeed.academicPeriodCode,
      new Date('2023-01-23'),
      new Date('2024-01-23'),
      businessUnit,
      1,
      this.superAdminUser,
    );

    academicPeriod.addAcademicProgram(academicProgram);
    await this.academicPeriodRepository.save(academicPeriod);
    const student = Student.createFromSGA(
      GetSearchStudentsE2eSeed.studentId,
      GetSearchStudentsE2eSeed.studentName,
      GetSearchStudentsE2eSeed.studentSurname,
      GetSearchStudentsE2eSeed.studentSurname2,
      GetSearchStudentsE2eSeed.studentEmail,
      GetSearchStudentsE2eSeed.studentUniversaeEmail,
      this.superAdminUser,
    );
    await this.studentRepository.save(student);
    const academicRecord = AcademicRecord.create(
      GetSearchStudentsE2eSeed.academicRecordId,
      businessUnit,
      virtualCampus,
      student,
      academicPeriod,
      academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      true,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(academicRecord);
  }

  async clear(): Promise<void> {
    await this.academicRecordRepository.delete(
      GetSearchStudentsE2eSeed.academicRecordId,
    );
    await this.studentRepository.delete(GetSearchStudentsE2eSeed.studentId);
    await this.programBlockRepository.delete(
      GetSearchStudentsE2eSeed.programBlockId,
    );
    await this.academicProgramRepository.delete(
      GetSearchStudentsE2eSeed.academicProgramId,
    );
    await this.academicPeriodRepository.delete(
      GetSearchStudentsE2eSeed.academicPeriodId,
    );

    await this.titleRepository.delete(GetSearchStudentsE2eSeed.titleId);
    await this.virtualCampusRepository.delete(
      GetSearchStudentsE2eSeed.virtualCampusId,
    );
    await this.businessUnitRepository.delete(
      GetSearchStudentsE2eSeed.businessUnitId,
    );
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
