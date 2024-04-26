export enum StudentOrigin {
  SGA = 'sga',
  CRM = 'crm',
}

export const getStudentOrigins = (): StudentOrigin[] => {
  return Object.values(StudentOrigin);
};
