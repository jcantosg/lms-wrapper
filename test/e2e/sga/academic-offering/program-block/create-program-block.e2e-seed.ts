import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export class CreateProgramBlockE2eSeed implements E2eSeed {
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

  private academicProgramRepository: Repository<AcademicProgram>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private programBlockRepository: Repository<ProgramBlock>;

  constructor(private dataSource: DataSource) {
    this.academicProgramRepository =
      this.dataSource.getRepository(AcademicProgram);
    this.businessUnitRepository = this.dataSource.getRepository(BusinessUnit);
    this.countryRepository = this.dataSource.getRepository(Country);
    this.titleRepository = this.dataSource.getRepository(Title);
    this.programBlockRepository = this.dataSource.getRepository(ProgramBlock);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      CreateProgramBlockE2eSeed.businessUnitId,
      CreateProgramBlockE2eSeed.businessUnitName,
      CreateProgramBlockE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      CreateProgramBlockE2eSeed.businessUnitId2,
      CreateProgramBlockE2eSeed.businessUnitName2,
      CreateProgramBlockE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      CreateProgramBlockE2eSeed.superAdminUserId,
      CreateProgramBlockE2eSeed.superAdminUserEmail,
      CreateProgramBlockE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      CreateProgramBlockE2eSeed.adminUserGestor360Id,
      CreateProgramBlockE2eSeed.adminUserGestor360Email,
      CreateProgramBlockE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      CreateProgramBlockE2eSeed.adminUserSecretariaId,
      CreateProgramBlockE2eSeed.adminUserSecretariaEmail,
      CreateProgramBlockE2eSeed.adminUserSecretariaPassword,
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
      CreateProgramBlockE2eSeed.academicProgramId,
      CreateProgramBlockE2eSeed.academicProgramName,
      CreateProgramBlockE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    await this.academicProgramRepository.save(this.academicProgram);

    this.secondAcademicProgram = AcademicProgram.create(
      CreateProgramBlockE2eSeed.academicProgramId2,
      CreateProgramBlockE2eSeed.academicProgramName2,
      CreateProgramBlockE2eSeed.academicProgramCode2,
      this.secondTitle,
      this.secondBusinessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );

    await this.academicProgramRepository.save(this.secondAcademicProgram);

    this.programBlock = ProgramBlock.create(
      CreateProgramBlockE2eSeed.programBlockId,
      CreateProgramBlockE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );

    await this.programBlockRepository.save(this.programBlock);
  }

  async clear(): Promise<void> {
    await this.programBlockRepository.delete({
      academicProgram: { id: CreateProgramBlockE2eSeed.academicProgramId },
    });
    await this.academicProgramRepository.delete(
      CreateProgramBlockE2eSeed.academicProgramId,
    );
    await this.academicProgramRepository.delete(
      CreateProgramBlockE2eSeed.academicProgramId2,
    );
    await this.titleRepository.delete(this.title.id);
    await this.titleRepository.delete(this.secondTitle.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.secretaryUser);
    await removeAdminUser(this.dataSource, this.superAdminUser);
  }
}
