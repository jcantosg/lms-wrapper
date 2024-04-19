import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export class GetSubjectsByProgramBlockE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static businessUnitId = '222fab6f-8205-46e6-961a-a92f47cbdc71';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static titleId = 'd66ffa3e-22e4-48ca-aeea-0c3b37fc70c3';
  public static titleName = 'Desarrollo de Aplicaciones Multiplataforma';
  public static titleOfficialCode = 'DAM';
  public static titleOfficialProgram = 'BOE-231';
  public static titleOfficialTitle =
    'Desarrollo de Aplicaciones Multiplataforma';

  public static academicProgramId = uuid();
  public static academicProgramName =
    'Administración de sistemas informaticos en red';
  public static academicProgramCode = 'ASIR';

  public static programBlockId = uuid();

  public static subjectId = 'd66ffa3e-22e4-48ca-aeea-0c3b37fc70c3';
  public static subjectName = 'Algoritmos y Estructuras de Datos II';
  public static subjectCode = 'AED2';
  public static subjectOfficialCode = 'BOE-231';
  public static subjectHours = 20;
  public static subjectModality = SubjectModality.PRESENCIAL;
  public static subjectEvaluationType = '8adeb962-3669-4c37-ada0-01328ef74c00';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;
  private academicProgram: AcademicProgram;
  private programBlock: ProgramBlock;
  private subject: Subject;

  private businessUnitRepository: Repository<BusinessUnit>;
  private titleRepository: Repository<Title>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private subjectRepository: Repository<Subject>;
  private countryRepository: Repository<Country>;
  private programBlockRepository: Repository<ProgramBlock>;

  constructor(private readonly datasource: DataSource) {
    this.countryRepository = datasource.getRepository(Country);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.titleRepository = datasource.getRepository(Title);
    this.subjectRepository = datasource.getRepository(Subject);
    this.evaluationTypeRepository = datasource.getRepository(EvaluationType);
    this.academicProgramRepository = datasource.getRepository(AcademicProgram);
    this.programBlockRepository = datasource.getRepository(ProgramBlock);
  }

  async arrange() {
    const country = await this.countryRepository.findOneByOrFail({ iso: 'ES' });
    this.businessUnit = BusinessUnit.create(
      GetSubjectsByProgramBlockE2eSeed.businessUnitId,
      GetSubjectsByProgramBlockE2eSeed.businessUnitName,
      GetSubjectsByProgramBlockE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetSubjectsByProgramBlockE2eSeed.superAdminUserId,
      GetSubjectsByProgramBlockE2eSeed.superAdminUserEmail,
      GetSubjectsByProgramBlockE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.title = Title.create(
      GetSubjectsByProgramBlockE2eSeed.titleId,
      GetSubjectsByProgramBlockE2eSeed.titleName,
      null,
      GetSubjectsByProgramBlockE2eSeed.titleOfficialTitle,
      GetSubjectsByProgramBlockE2eSeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    );
    await this.titleRepository.save(this.title);
    this.academicProgram = AcademicProgram.create(
      GetSubjectsByProgramBlockE2eSeed.academicProgramId,
      GetSubjectsByProgramBlockE2eSeed.academicProgramName,
      GetSubjectsByProgramBlockE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.SEMESTER,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      name: 'Proyecto',
    });
    this.subject = Subject.create(
      GetSubjectsByProgramBlockE2eSeed.subjectId,
      null,
      GetSubjectsByProgramBlockE2eSeed.subjectName,
      GetSubjectsByProgramBlockE2eSeed.subjectCode,
      GetSubjectsByProgramBlockE2eSeed.subjectOfficialCode,
      GetSubjectsByProgramBlockE2eSeed.subjectHours,
      GetSubjectsByProgramBlockE2eSeed.subjectModality,
      evaluationType,
      GetSubjectsByProgramBlockE2eSeed.subjectType,
      this.businessUnit,
      GetSubjectsByProgramBlockE2eSeed.subjectIsRegulated,
      GetSubjectsByProgramBlockE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);

    this.programBlock = ProgramBlock.create(
      GetSubjectsByProgramBlockE2eSeed.programBlockId,
      'Bloque 1',
      this.academicProgram,
      this.superAdminUser,
    );
    this.programBlock.subjects.push(this.subject);
    await this.programBlockRepository.save(this.programBlock);
  }

  async clear() {
    await this.subjectRepository.delete(this.subject.id);
    await this.programBlockRepository.delete(this.programBlock.id);
    await this.academicProgramRepository.delete(this.academicProgram.id);
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}