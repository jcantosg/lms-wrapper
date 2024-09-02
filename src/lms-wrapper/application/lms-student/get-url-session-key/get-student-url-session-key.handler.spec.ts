import { GetStudentUrlSessionKeyHandler } from '#lms-wrapper/application/lms-student/get-url-session-key/get-student-url-session-key.handler';
import { getASGAStudent } from '#test/entity-factory';
import { getALmsStudent } from '#test/value-object-factory';
import { LmsStudentMockRepository } from '#test/mocks/lms-wrapper/lms-student.mock-repository';
import { LmsStudentRepository } from '#lms-wrapper/domain/repository/lms-student.repository';
import { GetStudentUrlSessionKeyQuery } from '#lms-wrapper/application/lms-student/get-url-session-key/get-student-url-session-key.query';
import { LmsStudentNotInStudentException } from '#lms-wrapper/domain/exception/lms-student-not-in-student.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: GetStudentUrlSessionKeyHandler;
const studentLms = getASGAStudent();
studentLms.lmsStudent = getALmsStudent();
const studentWithoutLms = getASGAStudent();
let repository: LmsStudentRepository;
let getUrlSessionKeySpy: jest.SpyInstance;

describe('Get Url Session Key Handler', () => {
  beforeAll(async () => {
    repository = new LmsStudentMockRepository();
    handler = new GetStudentUrlSessionKeyHandler(repository);
    getUrlSessionKeySpy = jest.spyOn(repository, 'getUserSessionKeyUrl');
  });
  it('should return a url', async () => {
    getUrlSessionKeySpy.mockImplementation(() => Promise.resolve('url'));
    const query = new GetStudentUrlSessionKeyQuery(studentLms);
    const response = await handler.handle(query);
    expect(response).toBe('url');
  });
  it('should throw a LmsStudentNotInStudentException', () => {
    const query = new GetStudentUrlSessionKeyQuery(studentWithoutLms);
    expect(handler.handle(query)).rejects.toThrow(
      LmsStudentNotInStudentException,
    );
  });
  afterAll(() => {
    clearAllMocks();
  });
});
