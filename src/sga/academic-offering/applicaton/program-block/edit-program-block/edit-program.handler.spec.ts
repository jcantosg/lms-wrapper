import { EditProgramBlockHandler } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import { getAProgramBlockGetterMock } from '#test/service-factory';
import { getAnAdminUser, getAProgramBlock } from '#test/entity-factory';
import { EditProgramBlockCommand } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.command';
import clearAllMocks = jest.clearAllMocks;

let handler: EditProgramBlockHandler;
let repository: ProgramBlockRepository;
let programBlockGetter: ProgramBlockGetter;

let saveSpy: jest.SpyInstance;
let getProgramBlockSpy: jest.SpyInstance;
const programBlock = getAProgramBlock();
const command = new EditProgramBlockCommand(
  programBlock.id,
  'nuevo',
  getAnAdminUser(),
);

describe('Edit Program Handler Unit Test', () => {
  beforeAll(() => {
    repository = new ProgramBlockMockRepository();
    programBlockGetter = getAProgramBlockGetterMock();
    handler = new EditProgramBlockHandler(repository, programBlockGetter);
    saveSpy = jest.spyOn(repository, 'save');
    getProgramBlockSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
  });
  it('should edit a program block', async () => {
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: programBlock.id,
        name: 'nuevo',
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
