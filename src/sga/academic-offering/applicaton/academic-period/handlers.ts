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

const createAcademicPeriodHandler = {
  provide: CreateAcademicPeriodHandler,
  useFactory: (
    repository: AcademicPeriodRepository,
    businessUnitGetter: BusinessUnitGetter,
    eventDispatcher: EventDispatcher,
    periodBlockRepository: PeriodBlockRepository,
  ) => {
    return new CreateAcademicPeriodHandler(
      repository,
      businessUnitGetter,
      eventDispatcher,
      periodBlockRepository,
    );
  },
  inject: [
    AcademicPeriodRepository,
    BusinessUnitGetter,
    EventDispatcher,
    PeriodBlockRepository,
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
  ) => {
    return new EditAcademicPeriodHandler(getter, repository);
  },
  inject: [AcademicPeriodGetter, AcademicPeriodRepository],
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

export const academicPeriodHandlers = [
  createAcademicPeriodHandler,
  getAcademicPeriodHandler,
  editAcademicPeriodHandler,
  getAcademicPeriodHandler,
  getAllAcademicPeriodsHandler,
  searchAcademicPeriodsHandler,
  getAcademicPeriodsByBusinessUnitHandler,
];
