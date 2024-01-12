import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';

const businessUnitGetter = {
  provide: BusinessUnitGetter,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new BusinessUnitGetter(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

const examinationCenterGetter = {
  provide: ExaminationCenterGetter,
  useFactory: (examinationCenterRepository: ExaminationCenterRepository) => {
    return new ExaminationCenterGetter(examinationCenterRepository);
  },
  inject: [ExaminationCenterRepository],
};

export const services = [businessUnitGetter, examinationCenterGetter];
