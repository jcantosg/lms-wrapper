import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';

export interface GetAdministrativeGroupResponse {
  id: string;
  code: string;
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
  startMonth: MonthEnum;
  academicYear: string;
  blockName: string;
  studentsNumber: number;
  hasDelayedStudents: boolean;
}

export class GetAllAdministrativeGroupsResponse {
  static create(
    administrativeGroups: AdministrativeGroup[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetAdministrativeGroupResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: administrativeGroups.map(
        (
          administrativeGroup: AdministrativeGroup,
        ): GetAdministrativeGroupResponse => {
          return {
            id: administrativeGroup.id,
            code: administrativeGroup.code,
            businessUnit: {
              id: administrativeGroup.businessUnit.id,
              name: administrativeGroup.businessUnit.name,
            },
            academicProgram: {
              id: administrativeGroup.academicProgram.id,
              name: administrativeGroup.academicProgram.name,
              code: administrativeGroup.academicProgram.code,
            },
            academicPeriod: {
              id: administrativeGroup.academicPeriod.id,
              name: administrativeGroup.academicPeriod.name,
              code: administrativeGroup.academicPeriod.code,
            },
            startMonth: administrativeGroup.periodBlock.startMonth,
            academicYear: administrativeGroup.periodBlock.academicYear,
            blockName: administrativeGroup.periodBlock.name,
            studentsNumber: administrativeGroup.studentsNumber,
            hasDelayedStudents: administrativeGroup.hasDelayedStudents(),
          };
        },
      ),
    };
  }
}
