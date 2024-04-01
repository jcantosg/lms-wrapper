import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';

interface GetAllAcademicProgramResponse {
  id: string;
  name: string;
  code: string;
  title: {
    id: string;
    name: string;
    officialCode: string | null;
  };
  businessUnit: {
    id: string;
    name: string;
  };
}

export class GetAllAcademicProgramsResponse {
  static create(
    academicPrograms: AcademicProgram[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetAllAcademicProgramResponse> {
    return {
      items: academicPrograms.map(
        (academicProgram: AcademicProgram): GetAllAcademicProgramResponse => {
          return {
            id: academicProgram.id,
            name: academicProgram.name,
            code: academicProgram.code,
            title: {
              id: academicProgram.title.id,
              name: academicProgram.title.name,
              officialCode: academicProgram.title.officialCode,
            },
            businessUnit: {
              id: academicProgram.businessUnit.id,
              name: academicProgram.businessUnit.name,
            },
          };
        },
      ),
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
    };
  }
}
