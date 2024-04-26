export enum StudentGender {
  MALE = 'Hombre',
  FEMALE = 'Mujer',
  OTHER = 'Otro',
}

export const getAllStudentGenders = (): StudentGender[] => {
  return Object.values(StudentGender);
};
