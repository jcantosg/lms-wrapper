import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export interface BusinessUnitTeacherChatResponse {
  id: string;
  name: string;
}

export class GetBusinessUnitsTeacherChatResponse {
  static create(
    internalGroups: InternalGroup[],
  ): BusinessUnitTeacherChatResponse[] {
    const businessUnits = internalGroups.map((group) => ({
      id: group.businessUnit.id,
      name: group.businessUnit.name,
    }));

    return GetBusinessUnitsTeacherChatResponse.getUniqueBusinessUnits(
      businessUnits,
    );
  }

  private static getUniqueBusinessUnits(
    businessUnits: BusinessUnitTeacherChatResponse[],
  ): BusinessUnitTeacherChatResponse[] {
    const seenIds = new Set<string>();

    return businessUnits.filter((bu) => {
      if (seenIds.has(bu.id)) {
        return false;
      }

      seenIds.add(bu.id);

      return true;
    });
  }
}
