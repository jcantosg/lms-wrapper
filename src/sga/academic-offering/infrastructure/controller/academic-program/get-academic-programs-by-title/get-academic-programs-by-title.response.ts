import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';

interface AcademicProgramByTitleResponse {
  id: string;
  name: string;
  code: string;
  officialCode: string | null;
}

export class GetAcademicProgramsByTitleResponse {
  static create(
    academicPrograms: AcademicProgram[],
    page: number,
    total: number,
    limit: number,
  ): CollectionResponse<AcademicProgramByTitleResponse> {
    return {
      pagination: {
        page: page,
        total: total,
        limit: limit,
      },
      items: academicPrograms.map(
        (academicProgram: AcademicProgram): AcademicProgramByTitleResponse => ({
          id: academicProgram.id,
          name: academicProgram.name,
          code: academicProgram.code,
          officialCode: academicProgram.title.officialCode,
        }),
      ),
    };
  }
}
