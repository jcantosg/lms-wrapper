import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';

export interface GetInternalGroupResponse {
  id: string;
  code: string;
  startDate: Date;
  isDefault: boolean;
  businessUnit: {
    id: string;
    name: string;
  };
  academicProgram: {
    id: string;
    name: string;
    code: string;
  };
  academicPeriod: {
    id: string;
    name: string;
    code: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
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
            startDate: internalGroup.periodBlock.startDate,
            isDefault: internalGroup.isDefault,
            businessUnit: {
              id: internalGroup.businessUnit.id,
              name: internalGroup.businessUnit.name,
            },
            academicPeriod: {
              id: internalGroup.academicPeriod.id,
              name: internalGroup.academicPeriod.name,
              code: internalGroup.academicPeriod.code,
            },
            academicProgram: {
              id: internalGroup.academicProgram.id,
              name: internalGroup.academicProgram.name,
              code: internalGroup.academicProgram.code,
            },
            subject: {
              id: internalGroup.subject.id,
              name: internalGroup.subject.name,
              code: internalGroup.subject.code,
            },
          };
        },
      ),
    };
  }
}
