import { E2eSeed } from '#test/e2e/e2e-seed';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { v4 as uuid } from 'uuid';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

export class RemoveEdaeUserFromSubjectE2eSeed implements E2eSeed {
  public static subjectId = '07fbb4cc-032f-475e-9d6f-00f3984a37c1';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 300;
  public static subjectModality = SubjectModality.ELEARNING;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  public static superAdminUserEmail =
    'super-remove-add-edae-user-from-subject@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserGestor360Email =
    'remove-edae-user-from-subject@email.com';
  public static adminUserGestor360Password = 'pass123';
  public static adminUserGestor360Id = uuid();
  public static adminUserSecretariaId = uuid();
  public static adminUserSecretariaEmail = 'secretaria@universae.com';
  public static adminUserSecretariaPassword = 'pass123';

  public static businessUnitId = '5c1a3a4b-d462-4f2c-90c6-460ad65b48f2';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static businessUnitId2 = 'ba84c74d-e870-44f7-8f22-3b9efcb38331';
  public static businessUnitName2 = 'Madrid';
  public static businessUnitCode2 = 'MAD';

  public static edaeUserId = '726ab59a-3783-41f6-88a1-eafab62271dc';
  public static edaeName = 'Profesor Madrid';
  public static edaeUserEmail = 'profesor_madrid@universae.com';

  private subject: Subject;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private gestor360User: AdminUser;
  private secretaryUser: AdminUser;
  private edaeUser: EdaeUser;

  private subjectRepository: Repository<Subject>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private edaeUserRepository: Repository<EdaeUser>;
  private evaluationTypeRepository: Repository<EvaluationType>;

  constructor(private dataSource: DataSource) {
    this.subjectRepository = dataSource.getRepository(subjectSchema);
    this.businessUnitRepository = dataSource.getRepository(businessUnitSchema);
    this.countryRepository = dataSource.getRepository(CountrySchema);
    this.evaluationTypeRepository =
      dataSource.getRepository(evaluationTypeSchema);
    this.edaeUserRepository = dataSource.getRepository(edaeUserSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      RemoveEdaeUserFromSubjectE2eSeed.businessUnitId,
      RemoveEdaeUserFromSubjectE2eSeed.businessUnitName,
      RemoveEdaeUserFromSubjectE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      RemoveEdaeUserFromSubjectE2eSeed.businessUnitId2,
      RemoveEdaeUserFromSubjectE2eSeed.businessUnitName2,
      RemoveEdaeUserFromSubjectE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      RemoveEdaeUserFromSubjectE2eSeed.superAdminUserId,
      RemoveEdaeUserFromSubjectE2eSeed.superAdminUserEmail,
      RemoveEdaeUserFromSubjectE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      RemoveEdaeUserFromSubjectE2eSeed.adminUserGestor360Id,
      RemoveEdaeUserFromSubjectE2eSeed.adminUserGestor360Email,
      RemoveEdaeUserFromSubjectE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      RemoveEdaeUserFromSubjectE2eSeed.adminUserSecretariaId,
      RemoveEdaeUserFromSubjectE2eSeed.adminUserSecretariaEmail,
      RemoveEdaeUserFromSubjectE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    const evaluationType = await this.evaluationTypeRepository.findOne({
      where: { id: RemoveEdaeUserFromSubjectE2eSeed.subjectEvaluationType },
      relations: { businessUnits: true },
    });
    evaluationType!.businessUnits.push(this.businessUnit);
    await this.evaluationTypeRepository.save({
      id: evaluationType!.id,
      businessUnits: evaluationType!.businessUnits,
    });

    this.subject = Subject.create(
      RemoveEdaeUserFromSubjectE2eSeed.subjectId,
      RemoveEdaeUserFromSubjectE2eSeed.subjectName,
      'surname',
      RemoveEdaeUserFromSubjectE2eSeed.subjectCode,
      null,
      RemoveEdaeUserFromSubjectE2eSeed.subjectHours,
      RemoveEdaeUserFromSubjectE2eSeed.subjectModality,
      evaluationType,
      RemoveEdaeUserFromSubjectE2eSeed.subjectType,
      this.businessUnit,
      RemoveEdaeUserFromSubjectE2eSeed.subjectIsRegulated,
      RemoveEdaeUserFromSubjectE2eSeed.subjectIsCore,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(this.subject);

    this.edaeUser = EdaeUser.create(
      RemoveEdaeUserFromSubjectE2eSeed.edaeUserId,
      RemoveEdaeUserFromSubjectE2eSeed.edaeName,
      'surname',
      null,
      RemoveEdaeUserFromSubjectE2eSeed.edaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE, EdaeRoles.GESTOR_FCT],
      [this.secondBusinessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
      'password',
    );
    await this.edaeUserRepository.save(this.edaeUser);

    this.subject.addTeacher(this.edaeUser);
    await this.subjectRepository.save({
      id: this.subject.id,
      teachers: this.subject.teachers,
    });
  }

  async clear(): Promise<void> {
    await this.subjectRepository.delete(this.subject.id);
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.dataSource, this.secretaryUser);
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.superAdminUser);
  }
}
