import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import { getAProgramBlock } from '#test/entity-factory';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let repository: ProgramBlockRepository;
let programBlockGetter: ProgramBlockGetter;
const programBlock = getAProgramBlock();
let getSpy: jest.SpyInstance;

describe('Program Block Getter Service Unit Test', () => {
  beforeAll(async () => {
    repository = new ProgramBlockMockRepository();
    programBlockGetter = new ProgramBlockGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
  });
  it('should return a program block', async () => {
    getSpy.mockImplementation(
      (): Promise<ProgramBlock> => Promise.resolve(programBlock),
    );
    const getProgramBlock = await programBlockGetter.get(programBlock.id);
    expect(getProgramBlock).toEqual(programBlock);
  });
  it('should throw a ProgramBlockNotFoundException', () => {
    getSpy.mockImplementation(
      (): Promise<ProgramBlock | null> => Promise.resolve(null),
    );
    expect(programBlockGetter.get(programBlock.id)).rejects.toThrow(
      ProgramBlockNotFoundException,
    );
  });

  afterAll(async () => {
    clearAllMocks();
  });
});
