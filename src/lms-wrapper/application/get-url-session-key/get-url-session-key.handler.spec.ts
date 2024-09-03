import { GetUrlSessionKeyHandler } from '#lms-wrapper/application/get-url-session-key/get-url-session-key.handler';
import { getASGAStudent } from '#test/entity-factory';
import { getALmsStudent } from '#test/value-object-factory';
import { LmsStudentMockRepository } from '#test/mocks/lms-wrapper/lms-student.mock-repository';
import { LmsStudentRepository } from '#lms-wrapper/domain/repository/lms-student.repository';
import { GetUrlSessionKeyQuery } from '#lms-wrapper/application/get-url-session-key/get-url-session-key.query';
import { LmsStudentNotInStudentException } from '#lms-wrapper/domain/exception/lms-student-not-in-student.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: GetUrlSessionKeyHandler;
const studentLms = getASGAStudent();
studentLms.lmsStudent = getALmsStudent();
const studentWithoutLms = getASGAStudent();
let repository: LmsStudentRepository;
let getUrlSessionKeySpy: jest.SpyInstance;

describe('Get Url Session Key Handler', () => {
  beforeAll(async () => {
    repository = new LmsStudentMockRepository();
    handler = new GetUrlSessionKeyHandler(repository);
    getUrlSessionKeySpy = jest.spyOn(repository, 'getUserSessionKeyUrl');
  });
  it('should return a url', async () => {
    getUrlSessionKeySpy.mockImplementation(() => Promise.resolve('url'));
    const query = new GetUrlSessionKeyQuery(studentLms);
    const response = await handler.handle(query);
    expect(response).toBe('url');
  });
  it('should throw a LmsStudentNotInStudentException', () => {
    const query = new GetUrlSessionKeyQuery(studentWithoutLms);
    expect(handler.handle(query)).rejects.toThrow(
      LmsStudentNotInStudentException,
    );
  });
  afterAll(() => {
    clearAllMocks();
  });
});
