export enum SubjectType {
  SUBJECT = 'asignatura',
  TFG = 'Trabajo Fin de Grado/Máster',
  PRACTICE = 'practica',
}

export const getAllSubjectTypes = (): SubjectType[] =>
  Object.values(SubjectType);
