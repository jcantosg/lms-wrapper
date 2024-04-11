import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { GetAllAcademicPeriodsHandler } from '#academic-offering/applicaton/academic-period/get-all-academic-periods/get-all-academic-periods.handler';
import { SearchAcademicPeriodsHandler } from '#academic-offering/applicaton/academic-period/search-academic-periods/search-academic-periods.handler';
import { EditAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.handler';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { GetAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/get-academic-period/get-academic-period.handler';

const createAcademicPeriodHandler = {
  provide: CreateAcademicPeriodHandler,
  useFactory: (
    repository: AcademicPeriodRepository,
    examinationCallRepository: ExaminationCallRepository,
    businessUnitGetter: BusinessUnitGetter,
    eventDispatcher: EventDispatcher,
  ) => {
    return new CreateAcademicPeriodHandler(
      repository,
      examinationCallRepository,
      businessUnitGetter,
      eventDispatcher,
    );
  },
  inject: [
    AcademicPeriodRepository,
    ExaminationCallRepository,
    BusinessUnitGetter,
    EventDispatcher,
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

export const academicPeriodHandlers = [
  createAcademicPeriodHandler,
  getAcademicPeriodHandler,
  editAcademicPeriodHandler,
  getAcademicPeriodHandler,
  getAllAcademicPeriodsHandler,
  searchAcademicPeriodsHandler,
];