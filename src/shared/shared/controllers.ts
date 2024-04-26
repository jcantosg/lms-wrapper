import { HealthController } from '#shared/infrastructure/controller/health.controller';
import { GetCountryController } from '#shared/infrastructure/controller/country/get-countries.controller';
import { GetProvincesController } from '#shared/infrastructure/controller/province/get-provinces.controller';

export const controllers = [
  HealthController,
  GetCountryController,
  GetProvincesController,
];
