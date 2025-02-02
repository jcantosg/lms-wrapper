import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

export class EditProgramBlockE2eSeed implements E2eSeed {
  public static superAdminUserId = 'd97ec108-5c63-44be-93d1-59c48e64c24b';
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';

  public static adminUserId = 'c75e34b9-a7ce-4624-9c07-0cde40b7e688';
  public static adminUserEmail = 'secretaria@universae.com';
  public static adminUserPassword = 'pass123';

  public static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc71';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static titleId = '8a3b7f11-6c4e-4457-b78c-e07c4836be70';
  public static titleName = 'Grado En Desarrollo Web';
  public static titleCode = 'DAW2023';
  public static titleProgram = 'BOE-12123';

  public static academicProgramId = '61c97fd0-8a83-43e0-9138-b77bdf377c57';
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static subjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 32;
  public static subjectModality = SubjectModality.PRESENCIAL;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  public static programBlockId = '0812a90f-0e59-4a8e-9187-06ec1bb1e296';
  public static programBlockName = 'Bloque 1';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;
  private subject: Subject;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;

  private countryRepository: Repository<Country>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private titleRepository: Repository<Title>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private subjectRepository: Repository<Subject>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private programBlockRepository: Repository<ProgramBlock>;

  constructor(private readonly datasource: DataSource) {
    this.countryRepository = this.datasource.getRepository(CountrySchema);
    this.businessUnitRepository =
      this.datasource.getRepository(businessUnitSchema);
    this.titleRepository = this.datasource.getRepository(titleSchema);
    this.evaluationTypeRepository =
      this.datasource.getRepository(evaluationTypeSchema);
    this.subjectRepository = this.datasource.getRepository(subjectSchema);
    this.academicProgramRepository = this.datasource.getRepository(
      academicProgramSchema,
    );
    this.programBlockRepository =
      this.datasource.getRepository(programBlockSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({ iso: 'ES' });
    this.businessUnit = BusinessUnit.create(
      EditProgramBlockE2eSeed.businessUnitId,
      EditProgramBlockE2eSeed.businessUnitName,
      EditProgramBlockE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditProgramBlockE2eSeed.superAdminUserId,
      EditProgramBlockE2eSeed.superAdminUserEmail,
      EditProgramBlockE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      EditProgramBlockE2eSeed.adminUserId,
      EditProgramBlockE2eSeed.adminUserEmail,
      EditProgramBlockE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );
    this.title = Title.create(
      EditProgramBlockE2eSeed.titleId,
      EditProgramBlockE2eSeed.titleName,
      EditProgramBlockE2eSeed.titleCode,
      EditProgramBlockE2eSeed.titleCode,
      EditProgramBlockE2eSeed.titleProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);
    this.academicProgram = AcademicProgram.create(
      EditProgramBlockE2eSeed.academicProgramId,
      EditProgramBlockE2eSeed.academicProgramName,
      EditProgramBlockE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.SEMESTER,
    );
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: EditProgramBlockE2eSeed.subjectEvaluationType,
    });
    this.subject = Subject.create(
      EditProgramBlockE2eSeed.subjectId,
      null,
      EditProgramBlockE2eSeed.subjectName,
      EditProgramBlockE2eSeed.subjectCode,
      null,
      EditProgramBlockE2eSeed.subjectHours,
      EditProgramBlockE2eSeed.subjectModality,
      evaluationType,
      EditProgramBlockE2eSeed.subjectType,
      this.businessUnit,
      EditProgramBlockE2eSeed.subjectIsRegulated,
      EditProgramBlockE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    await this.academicProgramRepository.save(this.academicProgram);
    this.programBlock = ProgramBlock.create(
      EditProgramBlockE2eSeed.programBlockId,
      EditProgramBlockE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
  }

  async clear(): Promise<void> {
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
