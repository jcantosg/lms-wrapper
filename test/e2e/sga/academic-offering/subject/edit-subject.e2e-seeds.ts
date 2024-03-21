import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { v4 as uuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class EditSubjectE2eSeed implements E2eSeed {
  public static subjectId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 32;
  public static subjectModality = SubjectModality.PRESENCIAL;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  public static secondSubjectId = 'f554912f-fdec-49cc-ae70-5e49d01a9b08';
  public static secondSubjectName = 'Programación Orientada a Objectos';
  public static secondSubjectCode = 'UniversaePOO';
  public static secodeSubjectHours = 32;
  public static secondSubjectModality = SubjectModality.PRESENCIAL;
  public static secondSubjectEvaluationType =
    'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static secondSubjectType = SubjectType.SUBJECT;
  public static secondSubjectIsRegulated = true;
  public static secondSubjectIsCore = true;
  public static subjectOfficialRegionalCode = 'MUR';

  public static superAdminUserEmail = 'super-edit-subject@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'edit-subject@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  private firstSubject: Subject;
  private secondSubject: Subject;
  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private secretaryUser: AdminUser;

  private subjectRepository: Repository<Subject>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;

  constructor(private datasource: DataSource) {
    this.subjectRepository = datasource.getRepository(Subject);
    this.evaluationTypeRepository = datasource.getRepository(EvaluationType);
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });
    this.businessUnit = BusinessUnit.create(
      EditSubjectE2eSeed.businessUnitId,
      EditSubjectE2eSeed.businessUnitName,
      EditSubjectE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditSubjectE2eSeed.superAdminUserId,
      EditSubjectE2eSeed.superAdminUserEmail,
      EditSubjectE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.secretaryUser = await createAdminUser(
      this.datasource,
      EditSubjectE2eSeed.adminUserId,
      EditSubjectE2eSeed.adminUserEmail,
      EditSubjectE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [],
    );
    const evaluationType = await this.evaluationTypeRepository.findOne({
      where: { id: EditSubjectE2eSeed.subjectEvaluationType },
      relations: { businessUnits: true },
    });
    evaluationType!.businessUnits.push(this.businessUnit);
    await this.evaluationTypeRepository.save({
      id: evaluationType!.id,
      businessUnits: evaluationType!.businessUnits,
    });
    this.firstSubject = Subject.create(
      EditSubjectE2eSeed.subjectId,
      null,
      EditSubjectE2eSeed.subjectName,
      EditSubjectE2eSeed.subjectCode,
      null,
      EditSubjectE2eSeed.subjectHours,
      EditSubjectE2eSeed.subjectModality,
      evaluationType,
      EditSubjectE2eSeed.subjectType,
      this.businessUnit,
      EditSubjectE2eSeed.subjectIsRegulated,
      EditSubjectE2eSeed.subjectIsCore,
      this.superAdminUser,
      EditSubjectE2eSeed.subjectOfficialRegionalCode,
    );

    await this.subjectRepository.save(this.firstSubject);

    this.secondSubject = Subject.create(
      EditSubjectE2eSeed.secondSubjectId,
      null,
      EditSubjectE2eSeed.secondSubjectName,
      EditSubjectE2eSeed.secondSubjectCode,
      null,
      EditSubjectE2eSeed.secodeSubjectHours,
      EditSubjectE2eSeed.secondSubjectModality,
      evaluationType,
      EditSubjectE2eSeed.secondSubjectType,
      this.businessUnit,
      EditSubjectE2eSeed.secondSubjectIsRegulated,
      EditSubjectE2eSeed.secondSubjectIsCore,
      this.superAdminUser,
      EditSubjectE2eSeed.subjectOfficialRegionalCode,
    );

    await this.subjectRepository.save(this.secondSubject);
  }

  async clear(): Promise<void> {
    await this.subjectRepository.delete(this.firstSubject.id);
    await this.subjectRepository.delete(this.secondSubject.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.secretaryUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
