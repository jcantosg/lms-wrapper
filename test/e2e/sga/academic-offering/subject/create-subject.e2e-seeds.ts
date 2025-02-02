import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';

export class CreateSubjectE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-subject@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-subject@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static subjectId = 'd66ffa3e-22e4-48ca-aeea-0c3b37fc70c3';
  public static subjectName = 'Algoritmos y Estructuras de Datos III';
  public static subjectCode = 'AED3';
  public static subjectOfficialCode = 'BOE-232';
  public static subjectHours = 20;
  public static subjectModality = SubjectModality.ELEARNING;
  public static subjectEvaluationType = '8adeb962-3669-4c37-ada0-01328ef74c00';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectTypeSpecialty = SubjectType.SPECIALTY;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;
  public static secondSubjectId = '720d2d75-baea-4705-b926-6f004bf26192';
  public static secondSubjectCode = 'code';
  public static alreadyInsertedSubjectCode = 'the-code';
  public static subjectOfficialRegionalCode = 'MUR';

  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private secretaryUser: AdminUser;

  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private subjectRepository: Repository<Subject>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });
    this.businessUnit = BusinessUnit.create(
      CreateSubjectE2eSeed.businessUnitId,
      CreateSubjectE2eSeed.businessUnitName,
      CreateSubjectE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateSubjectE2eSeed.superAdminUserId,
      CreateSubjectE2eSeed.superAdminUserEmail,
      CreateSubjectE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.secretaryUser = await createAdminUser(
      this.datasource,
      CreateSubjectE2eSeed.adminUserId,
      CreateSubjectE2eSeed.adminUserEmail,
      CreateSubjectE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    await this.subjectRepository.save(
      Subject.create(
        uuid(),
        null,
        'subject name',
        CreateSubjectE2eSeed.alreadyInsertedSubjectCode,
        null,
        null,
        SubjectModality.ELEARNING,
        null,
        SubjectType.SUBJECT,
        this.businessUnit,
        false,
        false,
        this.superAdminUser,
        null,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.subjectRepository.delete({});
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.secretaryUser);
  }
}
