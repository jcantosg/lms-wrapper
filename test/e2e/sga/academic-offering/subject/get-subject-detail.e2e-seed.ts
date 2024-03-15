import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class GetSubjectDetailE2eSeed implements E2eSeed {
  public static subjectId = '83670209-9598-41d5-9c57-a393493f1b98';
  public static subjectName = 'name';
  public static subjectCode = 'code';
  public static subjectOfficialCode = 'officialCode';
  public static subjectImage = 'image';
  public static subjectModality = SubjectModality.ELEARNING;
  public static subjectType = SubjectType.SUBJECT;
  public static subjectIsRegulated = true;

  public static superAdminId = '91a46e8d-b032-488a-8ba3-322de1b20dc6';
  public static superAdminEmail = 'superadmin@email.com';
  public static superAdminPassword = 'pass123';
  public static superAdminRole = AdminUserRoles.SUPERADMIN;

  public static businessUnitId = 'd9c27778-3361-4d32-a81a-159a41df2924';
  public static businessUnitName = 'name';

  public static evaluationTypeId = 'c75fc98d-5295-48fc-a03a-95ac6e8d053d';
  public static evaluationTypeName = 'name';

  private superAdminUser: AdminUser;

  private businessUnit: BusinessUnit;
  private evaluationType: EvaluationType;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;
  private evaluationTypeRepository: Repository<EvaluationType>;
  private subjectRepository: Repository<Subject>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = this.datasource.getRepository(BusinessUnit);
    this.userRepository = this.datasource.getRepository(AdminUser);
    this.countryRepository = this.datasource.getRepository(Country);
    this.evaluationTypeRepository =
      this.datasource.getRepository(EvaluationType);
    this.subjectRepository = this.datasource.getRepository(Subject);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetSubjectDetailE2eSeed.superAdminId,
      GetSubjectDetailE2eSeed.superAdminEmail,
      GetSubjectDetailE2eSeed.superAdminPassword,
      [GetSubjectDetailE2eSeed.superAdminRole],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = BusinessUnit.create(
      GetSubjectDetailE2eSeed.businessUnitId,
      GetSubjectDetailE2eSeed.businessUnitName,
      'MAD',
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser.addBusinessUnit(this.businessUnit);
    await this.userRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.evaluationType = await this.evaluationTypeRepository.save(
      EvaluationType.create(
        GetSubjectDetailE2eSeed.evaluationTypeId,
        GetSubjectDetailE2eSeed.evaluationTypeName,
        100,
        0,
        0,
        true,
        [this.businessUnit],
      ),
    );
    this.subjectRepository.save(
      Subject.create(
        GetSubjectDetailE2eSeed.subjectId,
        GetSubjectDetailE2eSeed.subjectImage,
        GetSubjectDetailE2eSeed.subjectName,
        GetSubjectDetailE2eSeed.subjectCode,
        GetSubjectDetailE2eSeed.subjectOfficialCode,
        100,
        GetSubjectDetailE2eSeed.subjectModality,
        this.evaluationType,
        GetSubjectDetailE2eSeed.subjectType,
        this.businessUnit,
        GetSubjectDetailE2eSeed.subjectIsRegulated,
        true,
        this.superAdminUser,
      ),
    );
  }

  async clear() {
    await this.subjectRepository.delete(GetSubjectDetailE2eSeed.subjectId);
    await this.evaluationTypeRepository.delete(
      GetSubjectDetailE2eSeed.evaluationTypeId,
    );
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.superAdminUser.id);
  }
}
