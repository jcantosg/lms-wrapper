import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';

export interface GetAdministrativeGroupByAcademicProgramResponseInterface {
  id: string;
  name: string;
  code: string;
}

export class GetAdministrativeGroupByAcademicProgramResponse {
  static create(
    administrativeGroups: AdministrativeGroup[],
  ): GetAdministrativeGroupByAcademicProgramResponseInterface[] {
    return administrativeGroups.map((ag) => ({
      id: ag.id,
      name: ag.programBlock.name,
      code: ag.code,
    }));
  }
}
