import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createAdminUser } from '#test/e2e/sga/e2e-auth-helper';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class GetAcademicProgramDetailE2eSeed implements E2eSeed {
  public static academicProgramId = '83670209-9598-41d5-9c57-a393493f1b98';
  public static academicProgramName = 'name';
  public static academicProgramCode = 'code';

  public static titleId = '83670209-9598-41d5-9c57-a393493f1b99';
  public static titleName = 'title name';
  public static titleOfficialCode = 'officialCode';

  public static superAdminId = '91a46e8d-b032-488a-8ba3-322de1b20dc6';
  public static superAdminEmail = 'superadmin@email.com';
  public static superAdminPassword = 'pass123';
  public static superAdminRole = AdminUserRoles.SUPERADMIN;

  public static businessUnitId = 'd9c27778-3361-4d32-a81a-159a41df2924';
  public static businessUnitName = 'name';

  public static subjectId = 'd66ffa3e-22e4-48ca-aeea-0c3b37fc70c3';
  public static subjectName = 'Algoritmos y Estructuras de Datos II';
  public static subjectCode = 'AED2';
  public static specialtyId = '1830d89a-c51c-4428-af80-700aea72e22f';
  public static specialtyName = 'Especialidad 1';
  public static specialtyCode = 'specialty001';

  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private title: Title;
  private academicProgram: AcademicProgram;

  private businessUnitRepository: Repository<BusinessUnit>;
  private userRepository: Repository<AdminUser>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;
  private academicProgramRepository: Repository<AcademicProgram>;
  private subjectRepository: Repository<Subject>;
  private programBlockRepository: Repository<ProgramBlock>;
  private evaluationTypeRepository: Repository<EvaluationType>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository =
      this.datasource.getRepository(businessUnitSchema);
    this.userRepository = this.datasource.getRepository(adminUserSchema);
    this.countryRepository = this.datasource.getRepository(CountrySchema);
    this.titleRepository = this.datasource.getRepository(titleSchema);
    this.academicProgramRepository = this.datasource.getRepository(
      academicProgramSchema,
    );
    this.programBlockRepository = datasource.getRepository(programBlockSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAcademicProgramDetailE2eSeed.superAdminId,
      GetAcademicProgramDetailE2eSeed.superAdminEmail,
      GetAcademicProgramDetailE2eSeed.superAdminPassword,
      [GetAcademicProgramDetailE2eSeed.superAdminRole],
    );

    const country = (await this.countryRepository.findOne({
      where: { name: 'España' },
    })) as Country;

    this.businessUnit = BusinessUnit.create(
      GetAcademicProgramDetailE2eSeed.businessUnitId,
      GetAcademicProgramDetailE2eSeed.businessUnitName,
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

    this.title = await this.titleRepository.save(
      Title.create(
        GetAcademicProgramDetailE2eSeed.titleId,
        GetAcademicProgramDetailE2eSeed.titleName,
        GetAcademicProgramDetailE2eSeed.titleOfficialCode,
        'official title',
        'official program',
        this.businessUnit,
        this.superAdminUser,
      ),
    );
    this.academicProgram = AcademicProgram.create(
      GetAcademicProgramDetailE2eSeed.academicProgramId,
      GetAcademicProgramDetailE2eSeed.academicProgramName,
      GetAcademicProgramDetailE2eSeed.academicProgramCode,
      this.title,
      this.businessUnit,
      this.superAdminUser,
      ProgramBlockStructureType.CUSTOM,
    );
    await this.academicProgramRepository.save(this.academicProgram);

    const evaluationTypeFP =
      await this.evaluationTypeRepository.findOneByOrFail({
        name: 'Distancia FP',
      });
    const evaluationTypeNoEv =
      await this.evaluationTypeRepository.findOneByOrFail({
        name: 'No Evaluable',
      });

    const subject = Subject.create(
      GetAcademicProgramDetailE2eSeed.subjectId,
      null,
      GetAcademicProgramDetailE2eSeed.subjectName,
      GetAcademicProgramDetailE2eSeed.subjectCode,
      'officialcode',
      60,
      SubjectModality.ELEARNING,
      evaluationTypeFP,
      SubjectType.SUBJECT,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(subject);

    const specialty = Subject.create(
      GetAcademicProgramDetailE2eSeed.specialtyId,
      null,
      GetAcademicProgramDetailE2eSeed.specialtyName,
      GetAcademicProgramDetailE2eSeed.specialtyCode,
      'officialSpecialty',
      60,
      SubjectModality.ELEARNING,
      evaluationTypeNoEv,
      SubjectType.SPECIALTY,
      this.businessUnit,
      true,
      true,
      this.superAdminUser,
      null,
    );
    await this.subjectRepository.save(specialty);

    const programBlock = ProgramBlock.create(
      '3c8caff8-a1dd-482f-91db-79357507bbf6',
      'Bloque 1',
      this.academicProgram,
      this.superAdminUser,
    );
    programBlock.subjects.push(subject);
    programBlock.subjects.push(specialty);
    await this.programBlockRepository.save(programBlock);
  }

  async clear() {
    await this.programBlockRepository.delete({});
    await this.subjectRepository.delete({});
    await this.academicProgramRepository.delete(
      GetAcademicProgramDetailE2eSeed.academicProgramId,
    );
    await this.titleRepository.delete(this.title.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.userRepository.delete(this.superAdminUser.id);
  }
}
