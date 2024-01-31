import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ClassroomResponse } from '../get-business-unit/get-examination-center.response';

export interface ExaminationCenterResponse {
  id: string;
  name: string;
  code: string;
  address: string;
  businessUnits: ExaminationCenterBusinessUnitResponse[];
  isActive: boolean;
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
      address: examinationCenter.address,
      businessUnits: examinationCenter.businessUnits.map(
        (businessUnit: BusinessUnit): ExaminationCenterBusinessUnitResponse => {
          return {
            id: businessUnit.id,
            name: businessUnit.name,
          };
        },
      ),
      isActive: examinationCenter.isActive,
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
