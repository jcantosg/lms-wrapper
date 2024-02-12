import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  CountryResponse,
  GetCountryResponse,
} from '#shared/infrastructure/controller/country/get-country.response';
import {
  GetVirtualCampusResponse,
  VirtualCampusResponse,
} from '#business-unit/infrastructure/controller/business-unit/get-business-unit/get-virtual-campus.response';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterResponse } from '#business-unit/infrastructure/controller/business-unit/get-business-unit/get-examination-center.response';

export interface BusinessUnitExaminationCenterResponse {
  id: string;
  name: string;
  code: string;
  isMain: boolean;
}

export interface BusinessResponse {
  id: string;
  name: string;
  code: string;
  country: CountryResponse;
  virtualCampuses: VirtualCampusResponse[];
  examinationCenters: ExaminationCenterResponse[];
}

export class GetBusinessUnitResponse {
  static create(businessUnit: BusinessUnit) {
    return {
      id: businessUnit.id,
      name: businessUnit.name,
      code: businessUnit.code,
      country: GetCountryResponse.create(businessUnit.country),
      virtualCampuses: businessUnit.virtualCampuses.map(
        (virtualCampus: VirtualCampus) => {
          return GetVirtualCampusResponse.create(virtualCampus);
        },
      ),
      examinationCenters: businessUnit.examinationCenters.map(
        (
          examinationCenter: ExaminationCenter,
        ): BusinessUnitExaminationCenterResponse => ({
          id: examinationCenter.id,
          name: examinationCenter.name,
          code: examinationCenter.code,
          isMain: examinationCenter.isMainForBusinessUnit(businessUnit.id),
        }),
      ),
      isActive: businessUnit.isActive,
    };
  }
}
