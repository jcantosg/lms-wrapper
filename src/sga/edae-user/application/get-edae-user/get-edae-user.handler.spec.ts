import { GetEdaeUserHandler } from '#edae-user/application/get-edae-user/get-edae-user.handler';
import { GetEdaeUserQuery } from '#edae-user/application/get-edae-user/get-edae-user.query';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { getAnEdaeUser } from '#test/entity-factory';
import { getEdaeUserGetterMock } from '#test/service-factory';

let handler: GetEdaeUserHandler;
let edaeUserGetter: EdaeUserGetter;
let getSpy: any;

const edaeUser = getAnEdaeUser();
const query = new GetEdaeUserQuery(edaeUser.id, ['businessUnitId'], true);

describe('Get Edae User Handler', () => {
  beforeAll(() => {
    edaeUserGetter = getEdaeUserGetterMock();
    handler = new GetEdaeUserHandler(edaeUserGetter);
    getSpy = jest.spyOn(edaeUserGetter, 'getByAdminUser');
  });
  it('should return an edae user getter', async () => {
    getSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });
    const newEdaeUser = await handler.handle(query);
    expect(newEdaeUser).toEqual(edaeUser);
  });
  it('should throw an EdaeUserNotFoundException', async () => {
    getSpy.mockImplementation(() => {
      throw new EdaeUserNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      EdaeUserNotFoundException,
    );
  });
});
