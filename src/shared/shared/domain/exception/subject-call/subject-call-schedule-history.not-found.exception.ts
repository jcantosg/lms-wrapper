import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class SubjectCallScheduleHistoryNotFoundException extends NotFoundException {
  constructor() {
    super('sga.subject-call-schedule-history.not-found');
  }
}
