import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ClassroomResponse } from '../../business-unit/get-business-unit/get-examination-center.response';
import {
  CountryResponse,
  GetCountryResponse,
} from '#shared/infrastructure/controller/country/get-country.response';

export interface ExaminationCenterResponse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  country: CountryResponse;
  address: string;
  businessUnits: ExaminationCenterBusinessUnitResponse[];
  classrooms: ClassroomResponse[];
}

export interface ExaminationCenterBusinessUnitResponse {
  id: string;
  name: string;
}

export class GetExaminationCenterResponse {
  static create(
    examinationCenter: ExaminationCenter,
  ): ExaminationCenterResponse {
    return {
      id: examinationCenter.id,
      name: examinationCenter.name,
      code: examinationCenter.code,
      isActive: examinationCenter.isActive,
      country: GetCountryResponse.create(examinationCenter.country),
      address: examinationCenter.address,
      businessUnits: examinationCenter.businessUnits.map(
        (businessUnit: BusinessUnit): ExaminationCenterBusinessUnitResponse => {
          return {
            id: businessUnit.id,
            name: businessUnit.name,
          };
        },
      ),
      classrooms: examinationCenter.classrooms?.map(
        (classroom: Classroom): ClassroomResponse => {
          return {
            id: classroom.id,
            name: classroom.name,
            code: classroom.code,
            capacity: classroom.capacity,
          };
        },
      ),
    };
  }
}
