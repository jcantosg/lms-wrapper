import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

interface ListAcademicProgramByPeriodResponse {
  id: string;
  name: string;
  officialCode: string;
  code: string;
}

export class ListAcademicProgramsByPeriodResponse {
  static create(
    academicPrograms: AcademicProgram[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<ListAcademicProgramByPeriodResponse> {
    return {
      pagination: {
        page,
        limit,
        total,
      },
      items: academicPrograms.map((academicProgram) => {
        return {
          id: academicProgram.id,
          name: academicProgram.name,
          officialCode: academicProgram.code,
          code: academicProgram.code,
        };
      }),
    };
  }
}
