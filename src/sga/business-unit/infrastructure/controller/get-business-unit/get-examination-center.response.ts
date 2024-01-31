import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export interface ExaminationCenterResponse {
  name: string;
  code: string;
  isMain: boolean;
}

export class GetExaminationCenterResponse {
  static create(
    examinationCenter: ExaminationCenter,
    businessUnitId: string,
  ): ExaminationCenterResponse {
    return {
      name: examinationCenter.name,
      code: examinationCenter.code,
      isMain: examinationCenter.isMainForBusinessUnit(businessUnitId),
    };
  }
}
