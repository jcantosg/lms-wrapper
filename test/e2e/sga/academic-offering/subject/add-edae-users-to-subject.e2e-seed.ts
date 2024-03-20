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

export class AddEdaeUsersToSubjectE2eSeed implements E2eSeed {
  public static subjectId = '38f3a921-cdd4-46c6-b2a5-7eaf6cbd4544';
  public static subjectName = 'Algoritmos y Estructuras de Datos';
  public static subjectCode = 'UniversaeAED';
  public static subjectHours = 300;
  public static subjectModality = SubjectModality.ELEARNING;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;

  public static superAdminUserEmail =
    'super-add-edae-users-to-subject@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserGestor360Email = 'add-edae-users-to-subject@email.com';
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

  public static edaeUserId = '726ab59a-3783-41f6-88a1-eafab62271dc';
  public static edaeName = 'Profesor Barcelona';
  public static edaeUserEmail = 'profesor_barcelona@universae.com';
  public static secondEdaeUserId = uuid();
  public static secondEdaeName = 'Gestor FCT Madrid';
  public static secondEdaeUserEmail = 'gestor_fct@universae.com';
  public static thirdEdaeUserId = uuid();
  public static thirdEdaeName = 'Profesor Murcia';
  public static thirdEdaeUserEmail = 'profesor_murcia@universae.com';

  private subject: Subject;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private gestor360User: AdminUser;
  private secretaryUser: AdminUser;
  private edaeUser: EdaeUser;
  private secondEdaeUser: EdaeUser;
  private thirdEdaeUser: EdaeUser;

  private subjectRepository: Repository<Subject>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private edaeUserRepository: Repository<EdaeUser>;
  private evaluationTypeRepository: Repository<EvaluationType>;

  constructor(private dataSource: DataSource) {
    this.subjectRepository = dataSource.getRepository(Subject);
    this.businessUnitRepository = dataSource.getRepository(BusinessUnit);
    this.countryRepository = dataSource.getRepository(Country);
    this.evaluationTypeRepository = dataSource.getRepository(EvaluationType);
    this.edaeUserRepository = dataSource.getRepository(EdaeUser);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      AddEdaeUsersToSubjectE2eSeed.businessUnitId,
      AddEdaeUsersToSubjectE2eSeed.businessUnitName,
      AddEdaeUsersToSubjectE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      AddEdaeUsersToSubjectE2eSeed.businessUnitId2,
      AddEdaeUsersToSubjectE2eSeed.businessUnitName2,
      AddEdaeUsersToSubjectE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      AddEdaeUsersToSubjectE2eSeed.superAdminUserId,
      AddEdaeUsersToSubjectE2eSeed.superAdminUserEmail,
      AddEdaeUsersToSubjectE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      AddEdaeUsersToSubjectE2eSeed.adminUserGestor360Id,
      AddEdaeUsersToSubjectE2eSeed.adminUserGestor360Email,
      AddEdaeUsersToSubjectE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      AddEdaeUsersToSubjectE2eSeed.adminUserSecretariaId,
      AddEdaeUsersToSubjectE2eSeed.adminUserSecretariaEmail,
      AddEdaeUsersToSubjectE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    const evaluationType = await this.evaluationTypeRepository.findOne({
      where: { id: AddEdaeUsersToSubjectE2eSeed.subjectEvaluationType },
      relations: { businessUnits: true },
    });
    evaluationType!.businessUnits.push(this.businessUnit);
    await this.evaluationTypeRepository.save({
      id: evaluationType!.id,
      businessUnits: evaluationType!.businessUnits,
    });

    this.subject = Subject.create(
      AddEdaeUsersToSubjectE2eSeed.subjectId,
      AddEdaeUsersToSubjectE2eSeed.subjectName,
      'surname',
      AddEdaeUsersToSubjectE2eSeed.subjectCode,
      null,
      AddEdaeUsersToSubjectE2eSeed.subjectHours,
      AddEdaeUsersToSubjectE2eSeed.subjectModality,
      evaluationType,
      AddEdaeUsersToSubjectE2eSeed.subjectType,
      this.businessUnit,
      AddEdaeUsersToSubjectE2eSeed.subjectIsRegulated,
      AddEdaeUsersToSubjectE2eSeed.subjectIsCore,
      this.superAdminUser,
    );
    await this.subjectRepository.save(this.subject);

    this.edaeUser = EdaeUser.create(
      AddEdaeUsersToSubjectE2eSeed.edaeUserId,
      AddEdaeUsersToSubjectE2eSeed.edaeName,
      'surname',
      null,
      AddEdaeUsersToSubjectE2eSeed.edaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE, EdaeRoles.GESTOR_FCT],
      [this.secondBusinessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
    );
    await this.edaeUserRepository.save(this.edaeUser);

    this.secondEdaeUser = EdaeUser.create(
      AddEdaeUsersToSubjectE2eSeed.secondEdaeUserId,
      AddEdaeUsersToSubjectE2eSeed.secondEdaeName,
      'surname',
      null,
      AddEdaeUsersToSubjectE2eSeed.secondEdaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.GESTOR_FCT],
      [this.businessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
    );
    await this.edaeUserRepository.save(this.secondEdaeUser);

    this.thirdEdaeUser = EdaeUser.create(
      AddEdaeUsersToSubjectE2eSeed.thirdEdaeUserId,
      AddEdaeUsersToSubjectE2eSeed.thirdEdaeName,
      'surname',
      null,
      AddEdaeUsersToSubjectE2eSeed.thirdEdaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE],
      [this.businessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
    );
    await this.edaeUserRepository.save(this.thirdEdaeUser);
  }

  async clear(): Promise<void> {
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.edaeUserRepository.delete(this.secondEdaeUser.id);
    await this.edaeUserRepository.delete(this.thirdEdaeUser.id);
    await this.subjectRepository.delete(this.subject.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.secretaryUser);
    await removeAdminUser(this.dataSource, this.superAdminUser);
  }
}
