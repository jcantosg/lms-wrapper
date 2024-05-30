import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { GetAllAcademicPeriodsHandler } from '#academic-offering/applicaton/academic-period/get-all-academic-periods/get-all-academic-periods.handler';
import { SearchAcademicPeriodsHandler } from '#academic-offering/applicaton/academic-period/search-academic-periods/search-academic-periods.handler';
import { EditAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.handler';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { GetAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/get-academic-period/get-academic-period.handler';
import { GetAcademicPeriodsByBusinessUnitHandler } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.handler';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { EditPeriodBlockHandler } from '#academic-offering/applicaton/academic-period/edit-period-block/edit-period-block.handler';
import { PeriodBlockGetter } from '#academic-offering/domain/service/period-block/period-block-getter.service';
import { CreateAcademicPeriodTransactionService } from '#academic-offering/domain/service/academic-program/create-academic-period.transactional-service';
import { GetInternalGroupsHandler } from '#academic-offering/applicaton/academic-period/get-internal-groups/get-internal-groups.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { SearchInternalGroupsHandler } from '#academic-offering/applicaton/academic-period/search-internal-groups/search-internal-groups.handler';

const createAcademicPeriodHandler = {
  provide: CreateAcademicPeriodHandler,
  useFactory: (
    repository: AcademicPeriodRepository,
    businessUnitGetter: BusinessUnitGetter,
    eventDispatcher: EventDispatcher,
    transactionalService: CreateAcademicPeriodTransactionService,
  ) => {
    return new CreateAcademicPeriodHandler(
      repository,
      businessUnitGetter,
      eventDispatcher,
      transactionalService,
    );
  },
  inject: [
    AcademicPeriodRepository,
    BusinessUnitGetter,
    EventDispatcher,
    CreateAcademicPeriodTransactionService,
  ],
};
const getAllAcademicPeriodsHandler = {
  provide: GetAllAcademicPeriodsHandler,
  useFactory: (repository: AcademicPeriodRepository) => {
    return new GetAllAcademicPeriodsHandler(repository);
  },
  inject: [AcademicPeriodRepository],
};

const searchAcademicPeriodsHandler = {
  provide: SearchAcademicPeriodsHandler,
  useFactory: (repository: AcademicPeriodRepository) => {
    return new SearchAcademicPeriodsHandler(repository);
  },
  inject: [AcademicPeriodRepository],
};

const editAcademicPeriodHandler = {
  provide: EditAcademicPeriodHandler,
  useFactory: (
    getter: AcademicPeriodGetter,
    repository: AcademicPeriodRepository,
    periodBlockRepository: PeriodBlockRepository,
  ) => {
    return new EditAcademicPeriodHandler(
      getter,
      repository,
      periodBlockRepository,
    );
  },
  inject: [
    AcademicPeriodGetter,
    AcademicPeriodRepository,
    PeriodBlockRepository,
  ],
};

const getAcademicPeriodHandler = {
  provide: GetAcademicPeriodHandler,
  useFactory: (getter: AcademicPeriodGetter) => {
    return new GetAcademicPeriodHandler(getter);
  },
  inject: [AcademicPeriodGetter],
};

const getAcademicPeriodsByBusinessUnitHandler = {
  provide: GetAcademicPeriodsByBusinessUnitHandler,
  useFactory: (repository: AcademicPeriodRepository) => {
    return new GetAcademicPeriodsByBusinessUnitHandler(repository);
  },
  inject: [AcademicPeriodRepository],
};

const editPeriodBlockHandler = {
  provide: EditPeriodBlockHandler,
  useFactory: (
    getter: PeriodBlockGetter,
    repository: PeriodBlockRepository,
  ) => {
    return new EditPeriodBlockHandler(getter, repository);
  },
  inject: [PeriodBlockGetter, PeriodBlockRepository],
};

const listInternalGroupsHandler = {
  provide: GetInternalGroupsHandler,
  useFactory: (repository: InternalGroupRepository): GetInternalGroupsHandler =>
    new GetInternalGroupsHandler(repository),
  inject: [InternalGroupRepository],
};

const searchInternalGroupsHandler = {
  provide: SearchInternalGroupsHandler,
  useFactory: (
    repository: InternalGroupRepository,
  ): SearchInternalGroupsHandler => new SearchInternalGroupsHandler(repository),
  inject: [InternalGroupRepository],
};

export const academicPeriodHandlers = [
  createAcademicPeriodHandler,
  getAcademicPeriodHandler,
  editAcademicPeriodHandler,
  getAcademicPeriodHandler,
  getAllAcademicPeriodsHandler,
  searchAcademicPeriodsHandler,
  getAcademicPeriodsByBusinessUnitHandler,
  editPeriodBlockHandler,
  listInternalGroupsHandler,
  searchInternalGroupsHandler,
];
