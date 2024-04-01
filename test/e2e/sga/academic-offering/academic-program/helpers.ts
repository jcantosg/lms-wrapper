import { GetAllAcademicProgramsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/seed-data-config/get-all-academic-programs.e2e-seed-data-config';

export function expectAcademicPrograms(
  subjectsConfig: typeof GetAllAcademicProgramsE2eSeedDataConfig.academicPrograms,
) {
  return subjectsConfig.map((academicProgram) =>
    expect.objectContaining({
      id: academicProgram.id,
      name: academicProgram.name,
      code: academicProgram.code,
      title: expect.objectContaining({
        id: academicProgram.title.id,
        name: academicProgram.title.name,
      }),
      businessUnit: expect.objectContaining({
        id: academicProgram.businessUnit.id,
        name: academicProgram.businessUnit.name,
      }),
    }),
  );
}
