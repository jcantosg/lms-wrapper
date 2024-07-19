import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetInternalGroupDetailQuery } from './get-internal-group-detail.query';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';

export class GetInternalGroupDetailHandler implements QueryHandler {
  constructor(private readonly internalGroupGetter: InternalGroupGetter) {}

  async handle(query: GetInternalGroupDetailQuery): Promise<InternalGroup> {
    return await this.internalGroupGetter.getByAdminUser(
      query.internalGroupId,
      query.user,
    );
  }
}
