import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateBusinessUnitHandler } from '#business-unit/application/create-business-unit/create-business-unit.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { GetAllBusinessUnitsHandler } from '#business-unit/application/get-all-business-units/get-all-business-units.handler';
import { EditBusinessUnitHandler } from '#business-unit/application/edit-business-unit/edit-business-unit.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { GetBusinessUnitHandler } from '#business-unit/application/get-business-unit/get-business-unit.handler';
import { SearchBusinessUnitsHandler } from '#business-unit/application/search-business-units/search-business-units.handler';

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
const editBusinessUnitHandler = {
  provide: EditBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    businessGetter: BusinessUnitGetter,
    adminUserGetter: AdminUserGetter,
    countryGetter: CountryGetter,
  ) => {
    return new EditBusinessUnitHandler(
      businessUnitRepository,
      businessGetter,
      adminUserGetter,
      countryGetter,
    );
  },
  inject: [
    BusinessUnitRepository,
    BusinessUnitGetter,
    AdminUserGetter,
    CountryGetter,
  ],
};
const getBusinessUnitHandler = {
  provide: GetBusinessUnitHandler,
  useFactory: (businessUnitGetter: BusinessUnitGetter) => {
    return new GetBusinessUnitHandler(businessUnitGetter);
  },
  inject: [BusinessUnitGetter],
};

const getAllBusinessUnitsHandler = {
  provide: GetAllBusinessUnitsHandler,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new GetAllBusinessUnitsHandler(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

const searchBusinessUnitsHandler = {
  provide: SearchBusinessUnitsHandler,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new SearchBusinessUnitsHandler(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

export const handlers = [
  createBusinessUnitHandler,
  editBusinessUnitHandler,
  getAllBusinessUnitsHandler,
  createBusinessUnitHandler,
  editBusinessUnitHandler,
  getBusinessUnitHandler,
  searchBusinessUnitsHandler,
];
