import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { DataSource, Repository } from 'typeorm';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { Country } from '#shared/domain/entity/country.entity';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { academicRecordTransferSchema } from '#student/infrastructure/config/schema/academic-record-transfer.schema';
import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';

export class TransferAcademicRecordE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@test.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'admin@test.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '0e2e4107-7ba1-4f70-83b0-cf8b884a12eb';
  public static businessUnitName = 'Ciudad de Mexico';
  public static businessUnitCode = 'MEX';

  public static virtualCampusId = uuid();
  public static virtualCampusName = 'Virtual Campus Mexico';
  public static virtualCampusCode = 'VCM';

  public static programBlockId = uuid();
  public static programBlockName = 'BlockNameTest';

  public static academicPeriodId = 'ebaabf46-e215-4c9c-88b7-9cbc14ad3b12';
  public static academicPeriodName = '2023-2024';
  public static academicPeriodCode = '2023-2024';

  public static academicProgramId = '8ffac8f3-6677-4757-ae6f-07dbae6b0bd5';
  public static academicProgramName = 'Computer Science';
  public static academicProgramCode = 'CS';

  public static notIncludedAcademicProgramId =
    '8b8702ac-dd25-4c9c-a0fa-db71fdaa212a';
  public static notIncludedAcademicProgramName = 'Derecho Romano I';
  public static notIncludedAcademicProgramCode = 'DR';

  public static titleId = uuid();
  public static titleName = 'Ingenieria informatica';
  public static titleOfficialCode = 'II';
  public static titleOfficialTitle = 'Ingeniero informatico';
  public static titleOfficialProgram = 'Ingenieria informatica';

  public static studentId = uuid();
  public static studentName = 'John Doe';
  public static studentEmail = 'john.doe@test.com';
  public static universaeEmail = 'john.doe@universae.com';

  public static oldAcademicRecordId = uuid();
  public static newAcademicRecordId = uuid();

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private notIncludedAcademicProgram: AcademicProgram;
  private student: Student;
  private oldAcademicRecord: AcademicRecord;
  private title: Title;
  private programBlock: ProgramBlock;

  private countryRepository: Repository<Country>;
  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private titleRepository: Repository<Title>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private virtualCampusRepository: Repository<VirtualCampus>;
  private studentRepository: Repository<Student>;
  private academicRecordRepository: Repository<AcademicRecord>;
  private programBlockRepository: Repository<ProgramBlock>;
  private transferRepository: Repository<AcademicRecordTransfer>;

  constructor(private readonly datasource: DataSource) {
    this.academicPeriodRepository =
      datasource.getRepository(academicPeriodSchema);
    this.academicProgramRepository = datasource.getRepository(
      academicProgramSchema,
    );
    this.titleRepository = datasource.getRepository(titleSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
    this.studentRepository = datasource.getRepository(studentSchema);
    this.academicRecordRepository =
      datasource.getRepository(academicRecordSchema);
    this.programBlockRepository = datasource.getRepository(programBlockSchema);
    this.transferRepository = datasource.getRepository(
      academicRecordTransferSchema,
    );
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'México',
    });

    this.businessUnit = BusinessUnit.create(
      TransferAcademicRecordE2eSeed.businessUnitId,
      TransferAcademicRecordE2eSeed.businessUnitName,
      TransferAcademicRecordE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      TransferAcademicRecordE2eSeed.superAdminUserId,
      TransferAcademicRecordE2eSeed.superAdminUserEmail,
      TransferAcademicRecordE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      TransferAcademicRecordE2eSeed.adminUserId,
      TransferAcademicRecordE2eSeed.adminUserEmail,
      TransferAcademicRecordE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    this.virtualCampus = VirtualCampus.create(
      TransferAcademicRecordE2eSeed.virtualCampusId,
      TransferAcademicRecordE2eSeed.virtualCampusName,
      TransferAcademicRecordE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.virtualCampusRepository.save(this.virtualCampus);

    this.title = Title.create(
      TransferAcademicRecordE2eSeed.titleId,
      TransferAcademicRecordE2eSeed.titleName,
      TransferAcademicRecordE2eSeed.titleOfficialCode,
      TransferAcademicRecordE2eSeed.titleOfficialTitle,
      TransferAcademicRecordE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.notIncludedAcademicProgram = AcademicProgram.create(
      TransferAcademicRecordE2eSeed.notIncludedAcademicProgramId,
      TransferAcademicRecordE2eSeed.notIncludedAcademicProgramName,
      TransferAcademicRecordE2eSeed.notIncludedAcademicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.notIncludedAcademicProgram);

    this.academicProgram = AcademicProgram.create(
      TransferAcademicRecordE2eSeed.academicProgramId,
      TransferAcademicRecordE2eSeed.academicProgramName,
      TransferAcademicRecordE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    this.programBlock = ProgramBlock.create(
      TransferAcademicRecordE2eSeed.programBlockId,
      TransferAcademicRecordE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    this.academicProgram.addProgramBlock(this.programBlock);
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      TransferAcademicRecordE2eSeed.academicPeriodId,
      TransferAcademicRecordE2eSeed.academicPeriodName,
      TransferAcademicRecordE2eSeed.academicPeriodCode,
      new Date('2023-01-01'),
      new Date('2024-01-01'),
      this.businessUnit,
      1,
      this.superAdminUser,
    );
    this.academicPeriod.addAcademicProgram(this.academicProgram);
    this.academicPeriod.addPeriodBlocks([
      PeriodBlock.create(
        uuid(),
        this.academicPeriod,
        'Bloque 1',
        new Date(),
        new Date(),
        this.superAdminUser,
      ),
    ]);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.student = Student.createFromSGA(
      TransferAcademicRecordE2eSeed.studentId,
      TransferAcademicRecordE2eSeed.studentName,
      'Doe',
      'Smith',
      TransferAcademicRecordE2eSeed.studentEmail,
      TransferAcademicRecordE2eSeed.universaeEmail,
      this.superAdminUser,
      'password123',
      null,
    );
    await this.studentRepository.save(this.student);

    this.oldAcademicRecord = AcademicRecord.create(
      TransferAcademicRecordE2eSeed.oldAcademicRecordId,
      this.businessUnit,
      this.virtualCampus,
      this.student,
      this.academicPeriod,
      this.academicProgram,
      AcademicRecordModalityEnum.ELEARNING,
      false,
      this.superAdminUser,
    );
    await this.academicRecordRepository.save(this.oldAcademicRecord);
  }

  async clear(): Promise<void> {
    const allAcademicRecordsTransfers = await this.transferRepository.find();
    await this.transferRepository.delete(
      allAcademicRecordsTransfers.map(
        (academicRecordTransfer) => academicRecordTransfer.id,
      ),
    );
    await this.academicRecordRepository.delete(
      TransferAcademicRecordE2eSeed.oldAcademicRecordId,
    );
    await this.academicRecordRepository.delete(
      TransferAcademicRecordE2eSeed.newAcademicRecordId,
    );
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(
      this.notIncludedAcademicProgram.id,
    );
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.studentRepository.delete(this.student.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
