export enum SubjectCallFinalGradeEnum {
  ONGOING = '-',
  NP = 'NP',
  RC = 'RC',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  NA = 'n/a',
  PASS = 'Apto',
  FAIL = 'No Apto',
  EXEMPT = 'EX',
}

export const getAllSubjectFinalCallGrades = (): SubjectCallFinalGradeEnum[] =>
  Object.values(SubjectCallFinalGradeEnum);
