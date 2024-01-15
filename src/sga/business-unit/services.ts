import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';

const businessUnitGetter = {
  provide: BusinessUnitGetter,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new BusinessUnitGetter(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

const virtualCampusGetter = {
  provide: VirtualCampusGetter,
  useFactory: (virtualCampusRepository: VirtualCampusRepository) => {
    return new VirtualCampusGetter(virtualCampusRepository);
  },
  inject: [VirtualCampusRepository],
};

const examinationCenterGetter = {
  provide: ExaminationCenterGetter,
  useFactory: (examinationCenterRepository: ExaminationCenterRepository) => {
    return new ExaminationCenterGetter(examinationCenterRepository);
  },
  inject: [ExaminationCenterRepository],
};

export const services = [
  businessUnitGetter,
  virtualCampusGetter,
  examinationCenterGetter,
];
