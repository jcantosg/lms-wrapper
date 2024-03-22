import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

export interface AcademicProgramBusinessUnitResponse {
  id: string;
  name: string;
}

export interface AcademicProgramTitleResponse {
  id: string;
  name: string;
  officialCode: string;
}

export interface AcademicProgramResponse {
  id: string;
  name: string;
  code: string;
  title: AcademicProgramTitleResponse;
  businessUnit: AcademicProgramBusinessUnitResponse;
}

export class GetAcademicProgramResponse {
  static create(academicProgram: AcademicProgram): AcademicProgramResponse {
    return {
      id: academicProgram.id,
      name: academicProgram.name,
      code: academicProgram.code,
      title: {
        id: academicProgram.title.id,
        name: academicProgram.title.name,
        officialCode: academicProgram.title.officialCode ?? '',
      },
      businessUnit: {
        id: academicProgram.businessUnit.id,
        name: academicProgram.businessUnit.name,
      },
    };
  }
}
