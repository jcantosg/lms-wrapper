import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import {
  ExaminationCenterResponse,
  GetExaminationCenterResponse,
} from '#business-unit/infrastructure/controller/get-examination-center/get-examination-center.response';

export class GetAllExaminationCentersResponse {
  static create(
    examinationCenters: ExaminationCenter[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<ExaminationCenterResponse> {
    return {
      items: examinationCenters.map((examinationCenter) =>
        GetExaminationCenterResponse.create(examinationCenter),
      ),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
