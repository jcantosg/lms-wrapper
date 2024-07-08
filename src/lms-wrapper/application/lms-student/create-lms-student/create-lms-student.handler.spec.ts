import clearAllMocks = jest.clearAllMocks;
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { CreateLmsStudentCommand } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.command';
import { LmsStudentMockRepository } from '#test/mocks/lms-wrapper/lms-student.mock-repository';

let handler: CreateLmsStudentHandler;
let repository: LmsStudentRepository;
let saveSpy: jest.SpyInstance;
const command = new CreateLmsStudentCommand(
  'username',
  'name',
  'last name',
  'email@email.com',
  'encripted-password',
);

describe('Create LMS student Handler Test', () => {
  beforeAll(() => {
    repository = new LmsStudentMockRepository();
    handler = new CreateLmsStudentHandler(repository);
    saveSpy = jest.spyOn(repository, 'save');
  });
  it('should save a lms student', async () => {
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
