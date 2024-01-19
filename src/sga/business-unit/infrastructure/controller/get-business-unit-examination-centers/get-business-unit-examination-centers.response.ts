import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export interface BusinessUnitExaminationCenterResponse {
  id: string;
  code: string;
  name: string;
  classrooms: any[];
}

export class GetBusinessUnitExaminationCentersResponse {
  static create(
    examinationCenters: ExaminationCenter[],
  ): BusinessUnitExaminationCenterResponse[] {
    return examinationCenters.map((examinationCenter) => ({
      id: examinationCenter.id,
      code: examinationCenter.code,
      name: examinationCenter.name,
      classrooms: [],
    }));
  }
}
