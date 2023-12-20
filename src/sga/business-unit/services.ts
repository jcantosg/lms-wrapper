import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

const businessUnitGetter = {
  provide: BusinessUnitGetter,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new BusinessUnitGetter(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

export const services = [businessUnitGetter];
