import { HealthController } from '#shared/infrastructure/controller/health.controller';
import { GetCountryController } from '#shared/infrastructure/controller/country/get-countries.controller';
import { GetProvincesController } from '#shared/infrastructure/controller/province/get-provinces.controller';
import { communicationControllers } from '#shared/infrastructure/controller/communication/controllers';
import { GetCountryStudentController } from '#shared/infrastructure/controller/country/get-student-countries.controller';
import { GetStudentProvincesController } from '#shared/infrastructure/controller/province/get-student-provinces.controller';
import { GetStudentCitiesController } from '#shared/infrastructure/controller/city/get-cities.controller';

export const controllers = [
  HealthController,
  GetCountryController,
  GetProvincesController,
  ...communicationControllers,
  GetCountryStudentController,
  GetStudentProvincesController,
  GetStudentCitiesController,
];
