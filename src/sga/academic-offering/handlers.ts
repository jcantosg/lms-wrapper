import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/create-academic-period/create-academic-period.handler';
import { GetAllAcademicPeriodsHandler } from '#academic-offering/applicaton/get-all-academic-periods/get-all-academic-periods.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

const createAcademicPeriodHandler = {
  provide: CreateAcademicPeriodHandler,
  useFactory: (
    repository: AcademicPeriodRepository,
    examinationCallRepository: ExaminationCallRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new CreateAcademicPeriodHandler(
      repository,
      examinationCallRepository,
      businessUnitGetter,
    );
  },
  inject: [
    AcademicPeriodRepository,
    ExaminationCallRepository,
    BusinessUnitGetter,
  ],
};

const getAllAcademicPeriodsHandler = {
  provide: GetAllAcademicPeriodsHandler,
  useFactory: (repository: AcademicPeriodRepository) => {
    return new GetAllAcademicPeriodsHandler(repository);
  },
  inject: [AcademicPeriodRepository],
};

export const handlers = [
  createAcademicPeriodHandler,
  getAllAcademicPeriodsHandler,
];
