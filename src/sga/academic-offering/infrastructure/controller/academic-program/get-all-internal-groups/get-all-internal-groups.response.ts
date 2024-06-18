import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';

export interface GetAllInternalGroupResponse {
  id: string;
  code: string;
  academicPeriod: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  block: {
    id: string;
    name: string;
  };
}

export class GetAllInternalGroupsResponse {
  static create(
    internalGroups: InternalGroup[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetAllInternalGroupResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: internalGroups.map(
        (internalGroup: InternalGroup): GetAllInternalGroupResponse => {
          return {
            id: internalGroup.id,
            code: internalGroup.code,
            academicPeriod: {
              id: internalGroup.academicPeriod.id,
              name: internalGroup.academicPeriod.name,
            },
            subject: {
              id: internalGroup.subject.id,
              name: internalGroup.subject.name,
            },
            block: {
              id: internalGroup.periodBlock.id,
              name: internalGroup.periodBlock.name,
            },
          };
        },
      ),
    };
  }
}
