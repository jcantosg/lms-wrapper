export enum SubjectType {
  SUBJECT = 'Asignatura',
  TFG = 'Trabajo Fin de Grado/Máster',
  PRACTICE = 'Practica',
}

export const getAllSubjectTypes = (): SubjectType[] =>
  Object.values(SubjectType);
