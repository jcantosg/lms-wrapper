import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { Country } from '#shared/domain/entity/country.entity';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';

export class MoveStudentFromAdministrativeGroupE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@example.com';
  public static superAdminUserPassword = 'password123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'admin@example.com';
  public static adminUserPassword = 'password123';
  public static adminUserId = uuid();

  public static businessUnitId = uuid();
  public static businessUnitName = 'Main Unit';
  public static businessUnitCode = 'MU-01';

  public static originGroupId = uuid();
  public static originGroupCode = 'OG-01';

  public static destinationGroupId = uuid();
  public static destinationGroupCode = 'DG-01';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'MAD-INAS';

  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2025';
  public static academicPeriodCode = 'M-23-25';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 2;

  public static periodBlockId = uuid();
  public static periodBlockName = 'Bloque 1';
  public static periodBlockStartDate = '2023-09-01';
  public static periodBlockEndDate = '2024-08-01';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';
  public static programBlockId2 = uuid();
  public static programBlockName2 = 'Bloque 2';

  public static studentId = uuid();
  public static studentName = 'Juan';
  public static studentSurname = 'Ros';
  public static studentSurname2 = 'Lopez';
  public static studentEmail = 'juan@test.org';
  public static universaeEmail = 'juan.ros@universae.com';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private originGroup: AdministrativeGroup;
  private destinationGroup: AdministrativeGroup;
  private title: Title;
  private academicProgram: AcademicProgram;
  private academicPeriod: AcademicPeriod;
  private periodBlock: PeriodBlock;
  private programBlock: ProgramBlock;
  private student: Student;

  private businessUnitRepository: Repository<BusinessUnit>;
  private administrativeGroupRepository: Repository<AdministrativeGroup>;
  private studentRepository: Repository<Student>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private academicPeriodRepository: Repository<AcademicPeriod>;
  private periodBlockRepository: Repository<PeriodBlock>;
  private programBlockRepository: Repository<ProgramBlock>;
  private blockRelationRepository: Repository<BlockRelation>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.administrativeGroupRepository = datasource.getRepository(
      administrativeGroupSchema,
    );
    this.studentRepository = datasource.getRepository(studentSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.titleRepository = datasource.getRepository(titleSchema);
    this.academicProgramRepository = datasource.getRepository(
      academicProgramSchema,
    );
    this.academicPeriodRepository =
      datasource.getRepository(academicPeriodSchema);
    this.periodBlockRepository = datasource.getRepository(periodBlockSchema);
    this.programBlockRepository = datasource.getRepository(programBlockSchema);
    this.blockRelationRepository =
      datasource.getRepository(blockRelationSchema);
    this.studentRepository = datasource.getRepository(studentSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      MoveStudentFromAdministrativeGroupE2eSeed.businessUnitId,
      MoveStudentFromAdministrativeGroupE2eSeed.businessUnitName,
      MoveStudentFromAdministrativeGroupE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      MoveStudentFromAdministrativeGroupE2eSeed.superAdminUserId,
      MoveStudentFromAdministrativeGroupE2eSeed.superAdminUserEmail,
      MoveStudentFromAdministrativeGroupE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.adminUser = await createAdminUser(
      this.datasource,
      MoveStudentFromAdministrativeGroupE2eSeed.adminUserId,
      MoveStudentFromAdministrativeGroupE2eSeed.adminUserEmail,
      MoveStudentFromAdministrativeGroupE2eSeed.adminUserPassword,
      [AdminUserRoles.GESTOR_360],
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
      MoveStudentFromAdministrativeGroupE2eSeed.academicProgramId,
      MoveStudentFromAdministrativeGroupE2eSeed.academicProgramName,
      MoveStudentFromAdministrativeGroupE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.academicPeriod = AcademicPeriod.create(
      MoveStudentFromAdministrativeGroupE2eSeed.academicPeriodId,
      MoveStudentFromAdministrativeGroupE2eSeed.academicPeriodName,
      MoveStudentFromAdministrativeGroupE2eSeed.academicPeriodCode,
      new Date(
        MoveStudentFromAdministrativeGroupE2eSeed.academicPeriodStartDate,
      ),
      new Date(MoveStudentFromAdministrativeGroupE2eSeed.academicPeriodEndDate),
      this.businessUnit,
      MoveStudentFromAdministrativeGroupE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );
    this.academicPeriod.academicPrograms.push(this.academicProgram);
    await this.academicPeriodRepository.save(this.academicPeriod);

    this.periodBlock = PeriodBlock.create(
      MoveStudentFromAdministrativeGroupE2eSeed.periodBlockId,
      this.academicPeriod,
      MoveStudentFromAdministrativeGroupE2eSeed.periodBlockName,
      new Date(MoveStudentFromAdministrativeGroupE2eSeed.periodBlockStartDate),
      new Date(MoveStudentFromAdministrativeGroupE2eSeed.periodBlockEndDate),
      this.superAdminUser,
    );
    await this.periodBlockRepository.save(this.periodBlock);

    this.programBlock = ProgramBlock.create(
      MoveStudentFromAdministrativeGroupE2eSeed.programBlockId,
      MoveStudentFromAdministrativeGroupE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);

    this.academicProgram.programBlocks = [this.programBlock];

    await this.blockRelationRepository.save(
      BlockRelation.create(
        uuid(),
        this.periodBlock,
        this.programBlock,
        this.superAdminUser,
      ),
    );

    this.student = Student.createFromSGA(
      MoveStudentFromAdministrativeGroupE2eSeed.studentId,
      MoveStudentFromAdministrativeGroupE2eSeed.studentName,
      MoveStudentFromAdministrativeGroupE2eSeed.studentSurname,
      MoveStudentFromAdministrativeGroupE2eSeed.studentSurname2,
      MoveStudentFromAdministrativeGroupE2eSeed.studentEmail,
      MoveStudentFromAdministrativeGroupE2eSeed.universaeEmail,
      this.superAdminUser,
      'test123',
      null,
    );
    await this.studentRepository.save(this.student);

    this.originGroup = AdministrativeGroup.create(
      MoveStudentFromAdministrativeGroupE2eSeed.originGroupId,
      MoveStudentFromAdministrativeGroupE2eSeed.originGroupCode,
      this.businessUnit,
      this.academicPeriod,
      this.academicProgram,
      this.programBlock,
      this.periodBlock,
      this.superAdminUser,
    );
    this.originGroup.addStudent(this.student);
    await this.administrativeGroupRepository.save(this.originGroup);

    this.destinationGroup = AdministrativeGroup.create(
      MoveStudentFromAdministrativeGroupE2eSeed.destinationGroupId,
      MoveStudentFromAdministrativeGroupE2eSeed.destinationGroupCode,
      this.businessUnit,
      this.academicPeriod,
      this.academicProgram,
      this.programBlock,
      this.periodBlock,
      this.superAdminUser,
    );
    await this.administrativeGroupRepository.save(this.destinationGroup);
  }

  async clear(): Promise<void> {
    await this.studentRepository.delete(this.student.id);
    await this.administrativeGroupRepository.delete({});
    await this.blockRelationRepository.delete({});
    await this.periodBlockRepository.delete(this.periodBlock.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicPeriodRepository.delete(this.academicPeriod.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
