import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { getAnEdaeUser } from '#test/entity-factory';
import { EdaeUserMockRepository } from '#test/mocks/sga/edae-user/edae-user.mock-repository';

let service: EdaeUserGetter;
let edaeUserRepository: EdaeUserRepository;

let getUserSpy: any;

const user = getAnEdaeUser();

describe('Edae User Getter', () => {
  beforeAll(() => {
    edaeUserRepository = new EdaeUserMockRepository();

    getUserSpy = jest.spyOn(edaeUserRepository, 'get');

    service = new EdaeUserGetter(edaeUserRepository);
  });

  it('Should return an user', async () => {
    getUserSpy.mockImplementation((): Promise<EdaeUser | null> => {
      return Promise.resolve(user);
    });

    const result = await service.get('userId');

    expect(result).toBe(user);
  });

  it('Should throw a EdaeUserNotFoundException', async () => {
    getUserSpy.mockImplementation((): Promise<EdaeUser | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('userId')).rejects.toThrow(
      EdaeUserNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
