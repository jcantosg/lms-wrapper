import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export interface LmsTeacherValues {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class LmsTeacher extends ValueObject<LmsTeacherValues> {
  constructor(lmsTeacherValues: LmsTeacherValues) {
    super(lmsTeacherValues);
  }
}
