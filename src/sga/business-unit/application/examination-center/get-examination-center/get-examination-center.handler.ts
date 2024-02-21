import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { GetExaminationCenterQuery } from '#business-unit/application/examination-center/get-examination-center/get-examination-center.query';

export class GetExaminationCenterHandler implements QueryHandler {
  constructor(
    private readonly examinationGetterService: ExaminationCenterGetter,
  ) {}

  async handle(query: GetExaminationCenterQuery): Promise<ExaminationCenter> {
    return await this.examinationGetterService.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
      query.isSuperAdmin,
    );
  }
}
