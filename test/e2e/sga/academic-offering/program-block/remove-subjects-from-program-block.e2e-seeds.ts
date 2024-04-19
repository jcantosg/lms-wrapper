import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

export class RemoveSubjectsFromProgramBlockE2eSeed implements E2eSeed {
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
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  public static secondSubjectId = '2b864bff-7c46-4212-8e1d-4ea7acf38ca1';
  public static secondSubjectName = 'Programación Orientada a Objetos';
  public static secondSubjectCode = 'UniversaePOO';
  public static secondSubjectHours = 32;
  public static secondSubjectModality = SubjectModality.PRESENCIAL;
  public static secondSubjectType = SubjectType.SUBJECT;
  public static secondSubjectIsRegulated = true;
  public static secondSubjectIsCore = true;

  public static programBlockId = '0812a90f-0e59-4a8e-9187-06ec1bb1e296';
  public static programBlockName = 'Bloque 1';

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;
  private subject: Subject;
  private secondSubject: Subject;
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
    this.countryRepository = datasource.getRepository(Country);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.titleRepository = datasource.getRepository(Title);
    this.evaluationTypeRepository = datasource.getRepository(EvaluationType);
    this.subjectRepository = datasource.getRepository(Subject);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.programBlockRepository = datasource.getRepository(ProgramBlock);
  }

  async arrange() {
    const country = await this.countryRepository.findOneByOrFail({ iso: 'ES' });
    this.businessUnit = BusinessUnit.create(
      RemoveSubjectsFromProgramBlockE2eSeed.businessUnitId,
      RemoveSubjectsFromProgramBlockE2eSeed.businessUnitName,
      RemoveSubjectsFromProgramBlockE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveSubjectsFromProgramBlockE2eSeed.superAdminUserId,
      RemoveSubjectsFromProgramBlockE2eSeed.superAdminUserEmail,
      RemoveSubjectsFromProgramBlockE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      RemoveSubjectsFromProgramBlockE2eSeed.adminUserId,
      RemoveSubjectsFromProgramBlockE2eSeed.adminUserEmail,
      RemoveSubjectsFromProgramBlockE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
      [this.businessUnit],
    );
    this.title = Title.create(
      RemoveSubjectsFromProgramBlockE2eSeed.titleId,
      RemoveSubjectsFromProgramBlockE2eSeed.titleName,
      null,
      RemoveSubjectsFromProgramBlockE2eSeed.titleCode,
      RemoveSubjectsFromProgramBlockE2eSeed.titleProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      name: 'Proyecto',
    });
    this.subject = Subject.create(
      RemoveSubjectsFromProgramBlockE2eSeed.subjectId,
      null,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectName,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectCode,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectCode,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectHours,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectModality,
      evaluationType,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectType,
      this.businessUnit,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectIsRegulated,
      RemoveSubjectsFromProgramBlockE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    this.secondSubject = Subject.create(
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectId,
      null,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectName,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectCode,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectCode,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectHours,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectModality,
      evaluationType,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectType,
      this.businessUnit,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectIsRegulated,
      RemoveSubjectsFromProgramBlockE2eSeed.secondSubjectIsCore,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);
    await this.subjectRepository.save(this.secondSubject);
    this.academicProgram = AcademicProgram.create(
      RemoveSubjectsFromProgramBlockE2eSeed.academicProgramId,
      RemoveSubjectsFromProgramBlockE2eSeed.academicProgramName,
      RemoveSubjectsFromProgramBlockE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.SEMESTER,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    this.programBlock = ProgramBlock.create(
      RemoveSubjectsFromProgramBlockE2eSeed.programBlockId,
      RemoveSubjectsFromProgramBlockE2eSeed.programBlockName,
      this.academicProgram,
      this.superAdminUser,
    );
    this.programBlock.subjects = [this.subject, this.secondSubject];
    await this.programBlockRepository.save(this.programBlock);
  }

  async clear() {
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.subjectRepository.delete(this.secondSubject.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
