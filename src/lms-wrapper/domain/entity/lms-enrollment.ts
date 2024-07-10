import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

interface LmsEnrollmentValues {
  courseId: number;
  studentId: number;
  startDate: number;
  endDate: number;
}

export class LmsEnrollment extends ValueObject<LmsEnrollmentValues> {
  constructor(lmsEnrollmentValues: LmsEnrollmentValues) {
    super(lmsEnrollmentValues);
  }
}
