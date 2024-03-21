import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { DataSource, Repository } from 'typeorm';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';

export class UploadSubjectResourceE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-upload-subject-resource@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'upload-subject-resource@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static subjectId = 'c3fd7ccc-5683-4385-b4db-617e446e9627';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 32;
  public static subjectModality = SubjectModality.PRESENCIAL;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;
  public static subjectOfficialRegionalCode = 'MUR';

  public static subjectResourceId = '7320aeec-5238-4ac0-9b52-7fcad902f31e';

  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private secretaryUser: AdminUser;
  private subject: Subject;

  private businessUnitRepository: Repository<BusinessUnit>;
  private subjectRepository: Repository<Subject>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private subjectResourceRepository: Repository<SubjectResource>;
  private countryRepository: Repository<Country>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.subjectRepository = datasource.getRepository(Subject);
    this.subjectResourceRepository = datasource.getRepository(SubjectResource);
    this.countryRepository = datasource.getRepository(Country);
    this.evaluationTypeRepository = datasource.getRepository(EvaluationType);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });
    this.businessUnit = BusinessUnit.create(
      UploadSubjectResourceE2eSeed.businessUnitId,
      UploadSubjectResourceE2eSeed.businessUnitName,
      UploadSubjectResourceE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );

    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      UploadSubjectResourceE2eSeed.superAdminUserId,
      UploadSubjectResourceE2eSeed.superAdminUserEmail,
      UploadSubjectResourceE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.datasource,
      UploadSubjectResourceE2eSeed.adminUserId,
      UploadSubjectResourceE2eSeed.adminUserEmail,
      UploadSubjectResourceE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );
    const evaluationType = await this.evaluationTypeRepository.findOneByOrFail({
      id: UploadSubjectResourceE2eSeed.subjectEvaluationType,
    });
    this.subject = Subject.create(
      UploadSubjectResourceE2eSeed.subjectId,
      null,
      UploadSubjectResourceE2eSeed.subjectName,
      UploadSubjectResourceE2eSeed.subjectCode,
      null,
      UploadSubjectResourceE2eSeed.subjectHours,
      UploadSubjectResourceE2eSeed.subjectModality,
      evaluationType,
      UploadSubjectResourceE2eSeed.subjectType,
      this.businessUnit,
      UploadSubjectResourceE2eSeed.subjectIsRegulated,
      UploadSubjectResourceE2eSeed.subjectIsCore,
      this.superAdminUser,
      UploadSubjectResourceE2eSeed.subjectOfficialRegionalCode,
    );
    await this.subjectRepository.save(this.subject);
  }

  async clear(): Promise<void> {
    await this.subjectResourceRepository.delete(
      UploadSubjectResourceE2eSeed.subjectResourceId,
    );
    await this.subjectRepository.delete(UploadSubjectResourceE2eSeed.subjectId);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.secretaryUser);
    await this.businessUnitRepository.delete(this.businessUnit.id);
  }
}
