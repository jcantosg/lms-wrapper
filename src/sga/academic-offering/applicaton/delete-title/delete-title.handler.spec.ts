import { DeleteTitleHandler } from '#academic-offering/applicaton/delete-title/delete-title.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { getATitle } from '#test/entity-factory';
import { DeleteTitleCommand } from '#academic-offering/applicaton/delete-title/delete-title.command';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import { getATitleGetterMock } from '#test/service-factory';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';

import clearAllMocks = jest.clearAllMocks;

let handler: DeleteTitleHandler;
let repository: TitleRepository;
let titleGetter: TitleGetter;

let deleteSpy: jest.SpyInstance;
let getSpy: jest.SpyInstance;

const title = getATitle();

const command = new DeleteTitleCommand(
  title.id,
  [title.businessUnit.id],
  false,
);

describe('Delete Title Handler', () => {
  beforeAll(() => {
    repository = new TitleMockRepository();
    titleGetter = getATitleGetterMock();
    handler = new DeleteTitleHandler(repository, titleGetter);

    deleteSpy = jest.spyOn(repository, 'delete');
    getSpy = jest.spyOn(titleGetter, 'getByAdminUser');
  });

  it('should remove a title', async () => {
    getSpy.mockImplementation((): Promise<Title> => Promise.resolve(title));
    await handler.handle(command);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: title.id,
        name: title.name,
      }),
    );
  });

  /*@TODO add test checking it has academic programs */

  it('should return TitleNotFoundException', async () => {
    getSpy.mockImplementation((): Promise<Title> => {
      throw new TitleNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      TitleNotFoundException,
    );
  });

  afterAll(() => clearAllMocks());
});
