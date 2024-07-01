import { v4 as uuid } from 'uuid';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';

export class SetDefaultTeacherToSubjectE2eSeed implements E2eSeed {
  public static subjectId = uuid();
  public static subjectName = 'Programación';
  public static subjectCode = 'MAD-INAS01';
  public static subjectHours = 300;
  public static subjectModality = SubjectModality.ELEARNING;
  public static subjectEvaluationType = 'dd716f57-0609-4f53-96a7-e6231bc889af';
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;
  public static subjectIsCore = true;
  public static subjectRegionalCode = 'MAD';

  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserGestor360Email = 'gestor360@email.com';
  public static adminUserGestor360Password = 'pass123';
  public static adminUserGestor360Id = uuid();
  public static adminUserSecretariaId = uuid();
  public static adminUserSecretariaEmail = 'secretaria@universae.com';
  public static adminUserSecretariaPassword = 'pass123';

  public static businessUnitId2 = '222fab6f-8205-46e6-961a-a92f47cbdc72';
  public static businessUnitName2 = 'Madrid';
  public static businessUnitCode2 = 'MAD';

  public static edaeUserId = '726ab59a-3783-41f6-88a1-eafab62271dc';
  public static edaeName = 'Profesor Madrid';
  public static edaeUserEmail = 'profesor_madrid@universae.com';
  public static secondEdaeUserId = uuid();
  public static secondEdaeName = 'Profesor Madrid 2';
  public static secondEdaeUserEmail = 'profesor_madrid2@universae.com';

  private subject: Subject;
  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private gestor360User: AdminUser;
  private secretaryUser: AdminUser;
  private edaeUser: EdaeUser;
  private secondEdaeUser: EdaeUser;

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
      SetDefaultTeacherToSubjectE2eSeed.businessUnitId2,
      SetDefaultTeacherToSubjectE2eSeed.businessUnitName2,
      SetDefaultTeacherToSubjectE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      SetDefaultTeacherToSubjectE2eSeed.superAdminUserId,
      SetDefaultTeacherToSubjectE2eSeed.superAdminUserEmail,
      SetDefaultTeacherToSubjectE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      SetDefaultTeacherToSubjectE2eSeed.adminUserGestor360Id,
      SetDefaultTeacherToSubjectE2eSeed.adminUserGestor360Email,
      SetDefaultTeacherToSubjectE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.businessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      SetDefaultTeacherToSubjectE2eSeed.adminUserSecretariaId,
      SetDefaultTeacherToSubjectE2eSeed.adminUserSecretariaEmail,
      SetDefaultTeacherToSubjectE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    const evaluationType = await this.evaluationTypeRepository.findOne({
      where: { id: SetDefaultTeacherToSubjectE2eSeed.subjectEvaluationType },
      relations: { businessUnits: true },
    });
    evaluationType!.businessUnits.push(this.businessUnit);

    await this.evaluationTypeRepository.save({
      id: evaluationType!.id,
      businessUnits: evaluationType!.businessUnits,
    });

    this.subject = Subject.create(
      SetDefaultTeacherToSubjectE2eSeed.subjectId,
      SetDefaultTeacherToSubjectE2eSeed.subjectName,
      'surname',
      SetDefaultTeacherToSubjectE2eSeed.subjectCode,
      null,
      SetDefaultTeacherToSubjectE2eSeed.subjectHours,
      SetDefaultTeacherToSubjectE2eSeed.subjectModality,
      evaluationType,
      SetDefaultTeacherToSubjectE2eSeed.subjectType,
      this.businessUnit,
      SetDefaultTeacherToSubjectE2eSeed.subjectIsRegulated,
      SetDefaultTeacherToSubjectE2eSeed.subjectIsCore,
      this.superAdminUser,
      SetDefaultTeacherToSubjectE2eSeed.subjectRegionalCode,
    );
    await this.subjectRepository.save(this.subject);

    this.edaeUser = EdaeUser.create(
      SetDefaultTeacherToSubjectE2eSeed.edaeUserId,
      SetDefaultTeacherToSubjectE2eSeed.edaeName,
      'surname',
      null,
      SetDefaultTeacherToSubjectE2eSeed.edaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE, EdaeRoles.GESTOR_FCT],
      [this.businessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
      'password',
    );
    await this.edaeUserRepository.save(this.edaeUser);

    this.secondEdaeUser = EdaeUser.create(
      SetDefaultTeacherToSubjectE2eSeed.secondEdaeUserId,
      SetDefaultTeacherToSubjectE2eSeed.secondEdaeName,
      'surname',
      null,
      SetDefaultTeacherToSubjectE2eSeed.secondEdaeUserEmail,
      getAnIdentityDocument(),
      [EdaeRoles.DOCENTE],
      [this.businessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      true,
      country,
      null,
      'password',
    );
    await this.edaeUserRepository.save(this.secondEdaeUser);
    this.subject.addTeacher(this.edaeUser);

    await this.subjectRepository.save({
      id: this.subject.id,
      teachers: this.subject.teachers,
    });
  }

  async clear(): Promise<void> {
    await this.subjectRepository.delete(this.subject.id);
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.edaeUserRepository.delete(this.secondEdaeUser.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.secretaryUser);
    await removeAdminUser(this.dataSource, this.superAdminUser);
  }
}
