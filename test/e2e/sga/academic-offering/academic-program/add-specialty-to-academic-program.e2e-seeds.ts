import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

export class AddSpecialtyToAcademicProgramE2eSeed implements E2eSeed {
  public static superAdminUserId = 'd97ec108-5c63-44be-93d1-59c48e64c24b';
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';

  public static adminUserId = 'c75e34b9-a7ce-4624-9c07-0cde40b7e688';
  public static adminUserEmail = 'secretaria@universae.com';
  public static adminUserPassword = 'pass123';

  public static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc71';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static otherBusinessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc72';
  public static otherBusinessUnitName = 'Madrid';
  public static otherBusinessUnitCode = 'MAR';

  public static titleId = '8a3b7f11-6c4e-4457-b78c-e07c4836be70';
  public static titleName = 'Grado En Desarrollo Web';
  public static titleCode = 'DAW2023';
  public static titleProgram = 'BOE-12123';

  public static academicProgramId = '61c97fd0-8a83-43e0-9138-b77bdf377c57';
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static specialtyId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static specialtyType = SubjectType.SPECIALTY;
  public static otherSpecialtyId = 'ad1b657b-c378-4b55-a97f-d5050856ea65';
  public static subjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea66';
  public static subjectType = SubjectType.SUBJECT;

  public static programBlockId = '0812a90f-0e59-4a8e-9187-06ec1bb1e296';
  public static programBlockName = 'Bloque 1';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private otherBusinessUnit: BusinessUnit;
  private title: Title;
  private subject: Subject;
  private specialty: Subject;
  private otherSpecialty: Subject;
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
      AddSpecialtyToAcademicProgramE2eSeed.businessUnitId,
      AddSpecialtyToAcademicProgramE2eSeed.businessUnitName,
      AddSpecialtyToAcademicProgramE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    this.otherBusinessUnit = BusinessUnit.create(
      AddSpecialtyToAcademicProgramE2eSeed.otherBusinessUnitId,
      AddSpecialtyToAcademicProgramE2eSeed.otherBusinessUnitName,
      AddSpecialtyToAcademicProgramE2eSeed.otherBusinessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    await this.businessUnitRepository.save(this.otherBusinessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddSpecialtyToAcademicProgramE2eSeed.superAdminUserId,
      AddSpecialtyToAcademicProgramE2eSeed.superAdminUserEmail,
      AddSpecialtyToAcademicProgramE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.otherBusinessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      AddSpecialtyToAcademicProgramE2eSeed.adminUserId,
      AddSpecialtyToAcademicProgramE2eSeed.adminUserEmail,
      AddSpecialtyToAcademicProgramE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit, this.otherBusinessUnit],
    );
    this.title = Title.create(
      AddSpecialtyToAcademicProgramE2eSeed.titleId,
      AddSpecialtyToAcademicProgramE2eSeed.titleName,
      AddSpecialtyToAcademicProgramE2eSeed.titleCode,
      AddSpecialtyToAcademicProgramE2eSeed.titleCode,
      AddSpecialtyToAcademicProgramE2eSeed.titleProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);
    this.academicProgram = AcademicProgram.create(
      AddSpecialtyToAcademicProgramE2eSeed.academicProgramId,
      AddSpecialtyToAcademicProgramE2eSeed.academicProgramName,
      AddSpecialtyToAcademicProgramE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.SEMESTER,
    );
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: '7a84a7a1-772f-46a8-8d7b-7a167298a854',
    });
    this.subject = Subject.create(
      AddSpecialtyToAcademicProgramE2eSeed.subjectId,
      null,
      'subject name',
      'subject code',
      null,
      60,
      SubjectModality.ELEARNING,
      evaluationType,
      AddSpecialtyToAcademicProgramE2eSeed.subjectType,
      this.businessUnit,
      false,
      false,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);
    this.specialty = Subject.create(
      AddSpecialtyToAcademicProgramE2eSeed.specialtyId,
      null,
      'specialty name',
      'specialty code',
      null,
      60,
      SubjectModality.ELEARNING,
      evaluationType,
      AddSpecialtyToAcademicProgramE2eSeed.specialtyType,
      this.businessUnit,
      false,
      false,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.specialty);
    this.otherSpecialty = Subject.create(
      AddSpecialtyToAcademicProgramE2eSeed.otherSpecialtyId,
      null,
      'other specialty name',
      'other specialty code',
      null,
      60,
      SubjectModality.ELEARNING,
      evaluationType,
      AddSpecialtyToAcademicProgramE2eSeed.specialtyType,
      this.otherBusinessUnit,
      false,
      false,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.otherSpecialty);
    await this.academicProgramRepository.save(this.academicProgram);
    this.programBlock = ProgramBlock.create(
      AddSpecialtyToAcademicProgramE2eSeed.programBlockId,
      AddSpecialtyToAcademicProgramE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    await this.programBlockRepository.save(this.programBlock);
  }

  async clear(): Promise<void> {
    await this.programBlockRepository.delete({});
    await this.academicProgramRepository.delete({});
    await this.subjectRepository.delete({});
    await this.titleRepository.delete({});
    await this.businessUnitRepository.delete({});
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
