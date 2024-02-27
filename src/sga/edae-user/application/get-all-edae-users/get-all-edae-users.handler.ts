import { QueryHandler } from '#shared/domain/bus/query.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { GetAllEdaeUsersQuery } from '#edae-user/application/get-all-edae-users/get-all-edae-users.query';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { GetAllEdaeUsersCriteria } from '#edae-user/application/get-all-edae-users/get-all-edae-users.criteria';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllEdaeUsersHandler implements QueryHandler {
  constructor(
    private repository: EdaeUserRepository,
    private businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(
    query: GetAllEdaeUsersQuery,
  ): Promise<CollectionHandlerResponse<EdaeUser>> {
    const criteria = new GetAllEdaeUsersCriteria(query);
    const businessUnits = await Promise.all(
      query.adminUserBusinessUnits.map(
        async (businessUnitId: string): Promise<BusinessUnit> => {
          return await this.businessUnitGetter.get(businessUnitId);
        },
      ),
    );
    const [total, edaeUsers] = await Promise.all([
      this.repository.count(criteria, businessUnits, query.isSuperAdmin),
      this.repository.matching(criteria, businessUnits, query.isSuperAdmin),
    ]);

    return { total, items: edaeUsers };
  }
}
