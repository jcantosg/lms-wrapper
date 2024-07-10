import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class LmsCourseNotInSubjectException extends ConflictException {
  constructor() {
    super('lms-wrapper.course.not-in-subject');
  }
}
