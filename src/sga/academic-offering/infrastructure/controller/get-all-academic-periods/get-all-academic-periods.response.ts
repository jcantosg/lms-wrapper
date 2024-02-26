import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import {
  AcademicPeriodResponse,
  GetAcademicPeriodResponse,
} from '#academic-offering/infrastructure/controller/get-academic-period.response';

export class GetAllAcademicPeriodsResponse {
  static create(
    academicPeriods: AcademicPeriod[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<AcademicPeriodResponse> {
    return {
      items: academicPeriods.map((academicPeriod) =>
        GetAcademicPeriodResponse.create(academicPeriod),
      ),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
