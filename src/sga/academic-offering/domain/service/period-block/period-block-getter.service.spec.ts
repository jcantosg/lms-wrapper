import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlockGetter } from '#academic-offering/domain/service/period-block/period-block-getter.service';
import { PeriodBlockMockRepository } from '#test/mocks/sga/academic-offering/period-block.mock-repository';
import { getAPeriodBlock } from '#test/entity-factory';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { PeriodBlockNotFoundException } from '#shared/domain/exception/academic-offering/period-block.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let repository: PeriodBlockRepository;
let periodBlockGetter: PeriodBlockGetter;
const periodBlock = getAPeriodBlock();
let getSpy: jest.SpyInstance;

describe('Period Block Getter Service Unit Test', () => {
  beforeAll(async () => {
    repository = new PeriodBlockMockRepository();
    periodBlockGetter = new PeriodBlockGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
  });
  it('should return a period block', async () => {
    getSpy.mockImplementation(
      (): Promise<PeriodBlock> => Promise.resolve(periodBlock),
    );
    const getPeriodBlock = await periodBlockGetter.get(periodBlock.id);
    expect(getPeriodBlock).toEqual(periodBlock);
  });
  it('should throw a PeriodBlockNotFoundException', () => {
    getSpy.mockImplementation(
      (): Promise<PeriodBlock | null> => Promise.resolve(null),
    );
    expect(periodBlockGetter.get(periodBlock.id)).rejects.toThrow(
      PeriodBlockNotFoundException,
    );
  });

  afterAll(async () => {
    clearAllMocks();
  });
});
