import { DataSource, Repository } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AddBusinessUnitsToAdminUserE2eSeedDataConfig } from '#test/e2e/sga/admin-user/seed-data-config/add-business-units-to-admin-user.e2e-seed-data-config';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { GetAllSubjectsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/seed-data-config/get-all-subjects.e2e-seed-data-config';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';

export class GetAllSubjectsE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private gestor360MurciaUser: AdminUser;
  private businessUnits: BusinessUnit[];
  private spainCountry: Country;
  private subjects: Subject[];

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly adminUserRepository: Repository<AdminUser>;
  private readonly evaluationTypeRepository: Repository<EvaluationType>;
  private readonly subjectRepository: Repository<Subject>;

  constructor(private readonly datasource: DataSource) {
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.evaluationTypeRepository =
      datasource.getRepository(evaluationTypeSchema);
    this.subjectRepository = datasource.getRepository(subjectSchema);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.userId,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.password,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.superAdmin.roles,
    );

    this.gestor360MurciaUser = await createAdminUser(
      this.datasource,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.userId,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.email,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.password,
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.gestor360MurciaUser.roles,
    );

    this.spainCountry = (await this.countryRepository.findOne({
      where: {
        iso: 'ES',
      },
    })) as Country;

    this.businessUnits =
      AddBusinessUnitsToAdminUserE2eSeedDataConfig.businessUnits.map(
        (businessUnit) =>
          BusinessUnit.create(
            businessUnit.id,
            businessUnit.name,
            businessUnit.code,
            this.spainCountry,
            this.superAdminUser,
          ),
      );

    const savedBusinessUnits = await this.businessUnitRepository.save(
      this.businessUnits,
    );

    for (const bu of savedBusinessUnits) {
      this.superAdminUser.addBusinessUnit(bu);
    }

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    await this.adminUserRepository.save({
      id: this.gestor360MurciaUser.id,
      businessUnits: this.superAdminUser.businessUnits.filter(
        (bu) => bu.name === 'Murcia',
      ),
    });

    this.subjects = await Promise.all(
      GetAllSubjectsE2eSeedDataConfig.subjects.map(async (subject) =>
        Subject.create(
          subject.id,
          subject.imageUrl,
          subject.name,
          subject.code,
          subject.officialCode,
          subject.hours,
          subject.modality,
          await this.evaluationTypeRepository.findOne({
            where: {
              id: subject.evaluationType,
            },
          }),
          subject.type,
          (await this.businessUnitRepository.findOne({
            where: { name: subject.businessUnit },
          })) as BusinessUnit,
          subject.isRegulated,
          subject.isCore,
          this.superAdminUser,
          subject.officialRegionalCode,
        ),
      ),
    );

    await this.subjectRepository.save(this.subjects);
  }

  async clear(): Promise<void> {
    const subjectsIds = this.subjects.map((subject) => subject.id);
    await this.subjectRepository.delete(subjectsIds);
    const businessUnitsIds = this.businessUnits.map((bu) => bu.id);
    await this.businessUnitRepository.delete(businessUnitsIds);
    await removeAdminUser(this.datasource, this.gestor360MurciaUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
