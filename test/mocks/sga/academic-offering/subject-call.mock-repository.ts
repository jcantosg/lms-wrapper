import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';

export class SubjectCallMockRepository implements SubjectCallRepository {
  delete = jest.fn();

  save = jest.fn();
}
