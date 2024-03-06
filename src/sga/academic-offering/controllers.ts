import { CreateAcademicPeriodController } from '#academic-offering/infrastructure/controller/create-academic-period.controller';
import { GetAllAcademicPeriodsController } from '#academic-offering/infrastructure/controller/get-all-academic-periods/get-all-academic-periods.controller';
import { SearchAcademicPeriodsController } from '#academic-offering/infrastructure/controller/search-academic-periods.controller';

export const controllers = [
  CreateAcademicPeriodController,
  SearchAcademicPeriodsController,
  GetAllAcademicPeriodsController,
];
