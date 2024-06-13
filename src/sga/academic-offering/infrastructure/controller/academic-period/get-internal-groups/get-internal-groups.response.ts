import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';

export interface GetInternalGroupResponse {
  id: string;
  code: string;
  block: {
    id: string;
    name: string;
  };
  academicProgram: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
}

export class GetInternalGroupsResponse {
  static create(
    internalGroups: InternalGroup[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetInternalGroupResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: internalGroups.map(
        (internalGroup: InternalGroup): GetInternalGroupResponse => {
          return {
            id: internalGroup.id,
            code: internalGroup.code,
            block: {
              id: internalGroup.periodBlock.id,
              name: internalGroup.periodBlock.name,
            },
            academicProgram: {
              id: internalGroup.academicPeriod.id,
              name: internalGroup.academicPeriod.name,
            },
            subject: {
              id: internalGroup.academicPeriod.id,
              name: internalGroup.academicPeriod.name,
            },
          };
        },
      ),
    };
  }
}
