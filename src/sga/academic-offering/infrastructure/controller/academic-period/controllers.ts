import { EditAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-period/edit-academic-period.controller';
import { GetAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-period/get-academic-period.controller';
import { SearchAcademicPeriodsController } from '#academic-offering/infrastructure/controller/academic-period/search-academic-periods.controller';
import { GetAllAcademicPeriodsController } from '#academic-offering/infrastructure/controller/academic-period/get-all-academic-periods/get-all-academic-periods.controller';
import { CreateAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-period/create-academic-period.controller';

export const academicPeriodControllers = [
  EditAcademicPeriodController,
  GetAllAcademicPeriodsController,
  SearchAcademicPeriodsController,
  GetAcademicPeriodController,
  CreateAcademicPeriodController,
];
