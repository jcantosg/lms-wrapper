export enum SubjectType {
  SUBJECT = 'Asignatura',
  TFG = 'Trabajo Fin de Grado/Máster',
  PRACTICE = 'Practica',
  SPECIALTY = 'Especialidad',
  ELECTIVE = 'Optativa',
}

export const getAllSubjectTypes = (): SubjectType[] =>
  Object.values(SubjectType);
