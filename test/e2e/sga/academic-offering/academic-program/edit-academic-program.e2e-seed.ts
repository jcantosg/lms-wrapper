import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

export class EditAcademicProgramE2eSeed implements E2eSeed {
  public static academicProgramId = uuid();
  public static academicProgramName = 'Academic Program 1';
  public static academicProgramCode = 'OC1';

  public static academicProgramId2 = uuid();
  public static academicProgramName2 = 'Academic Program 2';
  public static academicProgramCode2 = 'OC2';

  public static programBlockId = uuid();
  public static programBlockName = 'Program Block 1';

  public static titleId = uuid();
  public static titleName = 'Title 1';
  public static titleOfficialCode = 'OC1';

  public static titleId2 = uuid();
  public static titleName2 = 'Title 2';
  public static titleOfficialCode2 = 'OC2';

  public static superAdminUserEmail = 'super-edit-academic-program@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserGestor360Email = 'edit-academic-program@email.com';
  public static adminUserGestor360Password = 'pass123';
  public static adminUserGestor360Id = uuid();
  public static adminUserSecretariaId = uuid();
  public static adminUserSecretariaEmail = 'secretaria@universae.com';
  public static adminUserSecretariaPassword = 'pass123';

  public static businessUnitId = uuid();
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static businessUnitId2 = uuid();
  public static businessUnitName2 = 'Madrid';
  public static businessUnitCode2 = 'MAD';

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

  private titleRepository: Repository<Title>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private programBlockRepository: Repository<ProgramBlock>;

  constructor(private dataSource: DataSource) {
    this.businessUnitRepository = dataSource.getRepository(businessUnitSchema);
    this.countryRepository = dataSource.getRepository(CountrySchema);
    this.titleRepository = dataSource.getRepository(titleSchema);
    this.academicProgramRepository = dataSource.getRepository(
      academicProgramSchema,
    );
    this.programBlockRepository = dataSource.getRepository(programBlockSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      EditAcademicProgramE2eSeed.businessUnitId,
      EditAcademicProgramE2eSeed.businessUnitName,
      EditAcademicProgramE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      EditAcademicProgramE2eSeed.businessUnitId2,
      EditAcademicProgramE2eSeed.businessUnitName2,
      EditAcademicProgramE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      EditAcademicProgramE2eSeed.superAdminUserId,
      EditAcademicProgramE2eSeed.superAdminUserEmail,
      EditAcademicProgramE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      EditAcademicProgramE2eSeed.adminUserGestor360Id,
      EditAcademicProgramE2eSeed.adminUserGestor360Email,
      EditAcademicProgramE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      EditAcademicProgramE2eSeed.adminUserSecretariaId,
      EditAcademicProgramE2eSeed.adminUserSecretariaEmail,
      EditAcademicProgramE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    this.title = Title.create(
      EditAcademicProgramE2eSeed.titleId,
      EditAcademicProgramE2eSeed.titleName,
      EditAcademicProgramE2eSeed.titleOfficialCode,
      'Official Title',
      'Official Program',
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);

    this.secondTitle = Title.create(
      EditAcademicProgramE2eSeed.titleId2,
      EditAcademicProgramE2eSeed.titleName2,
      EditAcademicProgramE2eSeed.titleOfficialCode2,
      'Official Title 2',
      'Official Program 2',
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.secondTitle);

    this.academicProgram = AcademicProgram.create(
      EditAcademicProgramE2eSeed.academicProgramId,
      EditAcademicProgramE2eSeed.academicProgramName,
      EditAcademicProgramE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    await this.academicProgramRepository.save(this.academicProgram);

    this.secondAcademicProgram = AcademicProgram.create(
      EditAcademicProgramE2eSeed.academicProgramId2,
      EditAcademicProgramE2eSeed.academicProgramName2,
      EditAcademicProgramE2eSeed.academicProgramCode2,
      this.title,
      this.secondBusinessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.secondAcademicProgram);

    this.programBlock = ProgramBlock.create(
      EditAcademicProgramE2eSeed.programBlockId,
      EditAcademicProgramE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    await this.programBlockRepository.save(this.programBlock);
  }

  async clear(): Promise<void> {
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.academicProgramRepository.delete(this.secondAcademicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.titleRepository.delete(this.secondTitle.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.dataSource, this.superAdminUser);
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.secretaryUser);
  }
}
