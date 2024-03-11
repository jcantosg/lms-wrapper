export enum SubjectModality {
  ELEARNING = 'e-learning',
  MIXED = 'mixta',
  PRESENCIAL = 'presencial',
}

export const getAllSubjectModalities = (): SubjectModality[] =>
  Object.values(SubjectModality);
