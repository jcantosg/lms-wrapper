import { QueryHandler } from '#shared/domain/bus/query.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { SearchEdaeUsersQuery } from '#edae-user/application/search-edae-users/search-edae-users.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { SearchEdaeUsersCriteria } from '#edae-user/application/search-edae-users/search-edae-users.criteria';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class SearchEdaeUsersHandler implements QueryHandler {
  constructor(
    private readonly repository: EdaeUserRepository,
    private businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(
    query: SearchEdaeUsersQuery,
  ): Promise<CollectionHandlerResponse<EdaeUser>> {
    const criteria = new SearchEdaeUsersCriteria(query);
    const businessUnits = await Promise.all(
      query.adminUserBusinessUnits.map(
        async (businessUnitId: string): Promise<BusinessUnit> => {
          return await this.businessUnitGetter.get(businessUnitId);
        },
      ),
    );
    const [total, edaeUsers] = await Promise.all([
      await this.repository.count(criteria, businessUnits, query.isSuperAdmin),
      await this.repository.matching(
        criteria,
        businessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: edaeUsers,
    };
  }
}
