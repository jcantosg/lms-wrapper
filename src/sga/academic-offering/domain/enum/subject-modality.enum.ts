export enum SubjectModality {
  ELEARNING = 'E-Learning',
  MIXED = 'Mixta',
  PRESENCIAL = 'Presencial',
}

export const getAllSubjectModalities = (): SubjectModality[] =>
  Object.values(SubjectModality);
