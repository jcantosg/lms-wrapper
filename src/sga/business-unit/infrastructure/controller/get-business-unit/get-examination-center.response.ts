import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export interface ExaminationCenterResponse {
  name: string;
  code: string;
}

export class GetExaminationCenterResponse {
  static create(
    examinationCenter: ExaminationCenter,
  ): ExaminationCenterResponse {
    return {
      name: examinationCenter.name,
      code: examinationCenter.code,
    };
  }
}
