import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateBusinessUnitHandler } from '#business-unit/application/create-business-unit/create-business-unit.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';

const createBusinessUnitHandler = {
  provide: CreateBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    adminUserGetter: AdminUserGetter,
    countryGetter: CountryGetter,
    virtualCampusRepository: VirtualCampusRepository,
    examinationCenterRepository: ExaminationCenterRepository,
  ) => {
    return new CreateBusinessUnitHandler(
      businessUnitRepository,
      adminUserGetter,
      countryGetter,
      virtualCampusRepository,
      examinationCenterRepository,
    );
  },
  inject: [
    BusinessUnitRepository,
    AdminUserGetter,
    CountryGetter,
    VirtualCampusRepository,
    ExaminationCenterRepository,
  ],
};

export const handlers = [createBusinessUnitHandler];
