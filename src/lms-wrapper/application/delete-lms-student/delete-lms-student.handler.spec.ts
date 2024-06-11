import clearAllMocks = jest.clearAllMocks;
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { LmsStudentMockRepository } from '#test/mocks/lms-wrapper/lms-student.mock-repository';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.handler';
import { DeleteLmsStudentCommand } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.command';

let handler: DeleteLmsStudentHandler;
let repository: LmsStudentRepository;
let deleteSpy: jest.SpyInstance;
const command = new DeleteLmsStudentCommand(123);

describe('Delete LMS student Handler Test', () => {
  beforeAll(() => {
    repository = new LmsStudentMockRepository();
    handler = new DeleteLmsStudentHandler(repository);
    deleteSpy = jest.spyOn(repository, 'delete');
  });
  it('should delete a lms student', async () => {
    await handler.handle(command);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
