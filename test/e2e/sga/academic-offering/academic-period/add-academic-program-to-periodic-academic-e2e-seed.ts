import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

export class AddAcademicProgramToPeriodicAcademicE2eSeed implements E2eSeed {
  public static academicPeriodId = uuid();
  public static academicPeriodName = 'Madrid 2023 2035';
  public static academicPeriodCode = 'MAD-2023-2035';
  public static academicPeriodStartDate = '2023-09-01';
  public static academicPeriodEndDate = '2025-09-01';
  public static academicPeriodBlocksNumber = 1;

  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserGestor360Email = 'gestor360@email.com';
  public static adminUserGestor360Password = 'pass123';
  public static adminUserGestor360Id = uuid();
  public static adminUserSecretariaId = uuid();
  public static adminUserSecretariaEmail = 'secretaria@universae.com';
  public static adminUserSecretariaPassword = 'pass123';

  public static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc71';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static businessUnitId2 = '222fab6f-8205-46e6-961a-a92f47cbdc72';
  public static businessUnitName2 = 'Madrid';
  public static businessUnitCode2 = 'MAD';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static academicProgramId2 = uuid();
  public static academicProgramName2 =
    'Desarrollo de aplicaciones multiplatorma';
  public static academicProgramCode2 = 'DAM';

  public static programBlockId = uuid();
  public static programBlockName = 'Bloque 1';

  private academicPeriod: AcademicPeriod;
  private academicProgram: AcademicProgram;
  private secondAcademicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private title: Title;
  private secondTitle: Title;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private gestor360User: AdminUser;
  private secretaryUser: AdminUser;

  private academicPeriodRepository: Repository<AcademicPeriod>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;

  constructor(private dataSource: DataSource) {
    this.academicPeriodRepository =
      this.dataSource.getRepository(academicPeriodSchema);
    this.countryRepository = dataSource.getRepository(CountrySchema);
    this.academicProgramRepository = this.dataSource.getRepository(
      academicProgramSchema,
    );
    this.businessUnitRepository =
      this.dataSource.getRepository(businessUnitSchema);
    this.titleRepository = this.dataSource.getRepository(titleSchema);
    this.programBlockRepository =
      this.dataSource.getRepository(programBlockSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitId,
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitName,
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitId2,
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitName2,
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      AddAcademicProgramToPeriodicAcademicE2eSeed.superAdminUserId,
      AddAcademicProgramToPeriodicAcademicE2eSeed.superAdminUserEmail,
      AddAcademicProgramToPeriodicAcademicE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserGestor360Id,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserGestor360Email,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserSecretariaId,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserSecretariaEmail,
      AddAcademicProgramToPeriodicAcademicE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    this.academicPeriod = AcademicPeriod.create(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodId,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodName,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodCode,
      new Date(
        AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodStartDate,
      ),
      new Date(
        AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodEndDate,
      ),
      this.businessUnit,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodBlocksNumber,
      this.superAdminUser,
    );

    await this.academicPeriodRepository.save(this.academicPeriod);

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

    this.secondTitle = Title.create(
      uuid(),
      'title2',
      'officialCode2',
      'officialTitle2',
      'officialProgram2',
      this.secondBusinessUnit,
      this.superAdminUser,
    );

    await this.titleRepository.save(this.secondTitle);

    this.academicProgram = AcademicProgram.create(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramName,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    await this.academicProgramRepository.save(this.academicProgram);

    this.secondAcademicProgram = AcademicProgram.create(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId2,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramName2,
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramCode2,
      this.secondTitle,
      this.secondBusinessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    await this.academicProgramRepository.save(this.secondAcademicProgram);

    this.programBlock = ProgramBlock.create(
      AddAcademicProgramToPeriodicAcademicE2eSeed.programBlockId,
      AddAcademicProgramToPeriodicAcademicE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
  }

  async clear(): Promise<void> {
    await this.programBlockRepository.delete(
      AddAcademicProgramToPeriodicAcademicE2eSeed.programBlockId,
    );
    await this.academicProgramRepository.delete(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId,
    );
    await this.academicProgramRepository.delete(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicProgramId2,
    );
    await this.academicPeriodRepository.delete(
      AddAcademicProgramToPeriodicAcademicE2eSeed.academicPeriodId,
    );
    await this.titleRepository.delete(this.title.id);
    await this.titleRepository.delete(this.secondTitle.id);
    await this.businessUnitRepository.delete(
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitId,
    );
    await this.businessUnitRepository.delete(
      AddAcademicProgramToPeriodicAcademicE2eSeed.businessUnitId2,
    );
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.secretaryUser);
    await removeAdminUser(this.dataSource, this.superAdminUser);
  }
}
