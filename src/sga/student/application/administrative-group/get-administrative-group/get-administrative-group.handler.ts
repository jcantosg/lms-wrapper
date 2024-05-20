import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetAdministrativeGroupQuery } from '#student/application/administrative-group/get-administrative-group/get-administrative-group.query';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';

export class GetAdministrativeGroupHandler implements QueryHandler {
  constructor(
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
  ) {}

  async handle(
    query: GetAdministrativeGroupQuery,
  ): Promise<AdministrativeGroup> {
    return await this.administrativeGroupGetter.getByAdminUser(
      query.id,
      query.adminUser,
    );
  }
}
