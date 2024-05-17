import { CreateAdministrativeGroupHandler } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { GetAllAdministrativeGroupsHandler } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.handler';
import { SearchAdministrativeGroupsHandler } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.handler';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';

const createAdministrativeGroupHandler = {
  provide: CreateAdministrativeGroupHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
    blockRelationRepository: BlockRelationRepository,
    businessUnitGetter: BusinessUnitGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    uuidService: UUIDGeneratorService,
  ): CreateAdministrativeGroupHandler =>
    new CreateAdministrativeGroupHandler(
      repository,
      blockRelationRepository,
      businessUnitGetter,
      academicPeriodGetter,
      academicProgramGetter,
      uuidService,
    ),
  inject: [
    AdministrativeGroupRepository,
    BlockRelationRepository,
    BusinessUnitGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    UUIDGeneratorService,
  ],
};

const getAllAdministrativeGroupsHandler = {
  provide: GetAllAdministrativeGroupsHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): GetAllAdministrativeGroupsHandler =>
    new GetAllAdministrativeGroupsHandler(repository),
  inject: [AdministrativeGroupRepository],
};

const searchAdministrativeGroupsHandler = {
  provide: SearchAdministrativeGroupsHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): SearchAdministrativeGroupsHandler =>
    new SearchAdministrativeGroupsHandler(repository),
  inject: [AdministrativeGroupRepository],
};

export const administrativeGroupHandlers = [
  createAdministrativeGroupHandler,
  getAllAdministrativeGroupsHandler,
  searchAdministrativeGroupsHandler,
];
