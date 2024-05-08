import { EditAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-period/edit-academic-period.controller';
import { GetAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-period/get-academic-period.controller';
import { SearchAcademicPeriodsController } from '#academic-offering/infrastructure/controller/academic-period/search-academic-periods.controller';
import { GetAllAcademicPeriodsController } from '#academic-offering/infrastructure/controller/academic-period/get-all-academic-periods/get-all-academic-periods.controller';
import { CreateAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-period/create-academic-period.controller';
import { GetAcademicPeriodsByBusinessUnitController } from '#academic-offering/infrastructure/controller/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.controller';
import { EditPeriodBlockController } from '#academic-offering/infrastructure/controller/academic-period/edit-period-block.controller';

export const academicPeriodControllers = [
  EditAcademicPeriodController,
  GetAllAcademicPeriodsController,
  SearchAcademicPeriodsController,
  GetAcademicPeriodsByBusinessUnitController,
  GetAcademicPeriodController,
  CreateAcademicPeriodController,
  EditPeriodBlockController,
];
