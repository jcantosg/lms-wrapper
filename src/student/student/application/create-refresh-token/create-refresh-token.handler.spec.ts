import { getASGAStudent } from '#test/entity-factory';
import { RefreshTokenMockRepository } from '#test/mocks/sga/adminUser/refresh-token.mock-repository';
import { getAStudentGetterMock } from '#test/service-factory';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';
import { CreateRefreshTokenHandler } from '#/student/student/application/create-refresh-token/create-refresh-token.handler';
import { CreateRefreshTokenCommand } from '#/student/student/application/create-refresh-token/create-refresh-token.command';
import { Student } from '#shared/domain/entity/student.entity';

let studentGetter: StudentGetter;
let refreshTokenRepository: StudentRefreshTokenRepository;
let handler: CreateRefreshTokenHandler;

let saveSpy: any;

const command = new CreateRefreshTokenCommand('tokenId', 'studentId', 1000);

describe('Create refresh token handler', () => {
  beforeEach(() => {
    studentGetter = getAStudentGetterMock();
    refreshTokenRepository = new RefreshTokenMockRepository();
    saveSpy = jest.spyOn(refreshTokenRepository, 'save');

    handler = new CreateRefreshTokenHandler(
      studentGetter,
      refreshTokenRepository,
    );
  });

  it('Should create a refresh token', async () => {
    const student = getASGAStudent();
    jest
      .spyOn(studentGetter, 'get')
      .mockImplementation((): Promise<Student> => {
        return Promise.resolve(student);
      });

    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tokenId',
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});