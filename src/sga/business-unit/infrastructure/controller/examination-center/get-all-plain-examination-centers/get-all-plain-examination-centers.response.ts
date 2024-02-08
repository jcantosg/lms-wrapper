import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export interface ExaminationCenterBaseResponse {
  id: string;
  name: string;
}

export class GetAllPlainExaminationCentersResponse {
  static create(
    examinationsCenters: ExaminationCenter[],
  ): ExaminationCenterBaseResponse[] {
    return examinationsCenters.map((examinationCenter) => {
      return {
        id: examinationCenter.id,
        name: examinationCenter.name,
      };
    });
  }
}
