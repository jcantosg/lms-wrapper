import { GetAcademicPeriodQuery } from '#academic-offering/applicaton/get-academic-period/get-academic-period.query';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class GetAcademicPeriodHandler implements QueryHandler {
  constructor(private readonly academicPeriodGetter: AcademicPeriodGetter) {}

  async handle(query: GetAcademicPeriodQuery): Promise<AcademicPeriod> {
    return await this.academicPeriodGetter.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
      query.isSuperAdmin,
    );
  }
}
