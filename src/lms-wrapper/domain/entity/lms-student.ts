import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export interface LmsStudentValues {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class LmsStudent extends ValueObject<LmsStudentValues> {
  constructor(lmsStudentValues: LmsStudentValues) {
    super(lmsStudentValues);
  }
}
