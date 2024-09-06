import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export interface InternalGroupResponseBasic {
  id: string;
  name: string;
}

export class GetInternalGroupsByBuPeriodsAndProgramsResponse {
  static create(internalGroups: InternalGroup[]): InternalGroupResponseBasic[] {
    return internalGroups.map((group) => ({
      id: group.id,
      name: group.code,
    }));
  }
}
