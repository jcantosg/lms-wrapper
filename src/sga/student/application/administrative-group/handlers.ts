import { CreateAdministrativeGroupHandler } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

const createAdministrativeGroupHandler = {
  provide: CreateAdministrativeGroupHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
    businessUnitGetter: BusinessUnitGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    uuidService: UUIDGeneratorService,
  ): CreateAdministrativeGroupHandler =>
    new CreateAdministrativeGroupHandler(
      repository,
      businessUnitGetter,
      academicPeriodGetter,
      academicProgramGetter,
      uuidService,
    ),
  inject: [
    AdministrativeGroupRepository,
    BusinessUnitGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    UUIDGeneratorService,
  ],
};

export const administrativeGroupHandlers = [createAdministrativeGroupHandler];
