import { GetAllSubjectsE2eSeedDataConfig } from '#test/e2e/sga/academic-offering/seed-data-config/get-all-subjects.e2e-seed-data-config';

export function expectSubjects(
  subjectsConfig: typeof GetAllSubjectsE2eSeedDataConfig.subjects,
) {
  return subjectsConfig.map((subject) =>
    expect.objectContaining({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      officialCode: subject.officialCode,
      modality: subject.modality,
      evaluationType: expect.objectContaining({
        id: subject.evaluationType,
      }),
      type: subject.type,
      businessUnit: expect.objectContaining({
        name: subject.businessUnit,
      }),
      isRegulated: subject.isRegulated,
    }),
  );
}
