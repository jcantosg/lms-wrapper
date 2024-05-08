import { v4 as uuid } from 'uuid';
import { getAPeriodBlockGetterMock } from '#test/service-factory';
import { getAPeriodBlock } from '#test/entity-factory';
import { EditPeriodBlockHandler } from '#academic-offering/applicaton/academic-period/edit-period-block/edit-period-block.handler';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlockGetter } from '#academic-offering/domain/service/period-block/period-block-getter.service';
import { EditPeriodBlockCommand } from '#academic-offering/applicaton/academic-period/edit-period-block/edit-period-block.command';
import { PeriodBlockMockRepository } from '#test/mocks/sga/academic-offering/period-block.mock-repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { PeriodBlockInvalidException } from '#shared/domain/exception/academic-offering/period-block.invalid.exception';
import { PeriodBlockInvalidDateException } from '#shared/domain/exception/academic-offering/period-block.invalid-date.exception';

let handler: EditPeriodBlockHandler;
let periodBlockRepository: PeriodBlockRepository;
let periodBlockGetter: PeriodBlockGetter;

let saveSpy: any;
let getPeriodBlockSpy: any;
let getPeriodBlockListSpy: any;

const wrongCommand = new EditPeriodBlockCommand(
  uuid(),
  new Date('2025-03-12'),
  [],
  true,
);
const rightCommand = new EditPeriodBlockCommand(
  uuid(),
  new Date('2025-02-12'),
  [],
  true,
);

const firstPeriodBlock = getAPeriodBlock(
  uuid(),
  new Date('2025-01-01'),
  new Date('2025-02-01'),
);

const secondPeriodBlock = getAPeriodBlock(
  uuid(),
  new Date('2025-02-01'),
  new Date('2025-03-01'),
);

const periodBlockList = [
  firstPeriodBlock,
  secondPeriodBlock,
  getAPeriodBlock(uuid(), new Date('2025-03-01'), new Date('2025-04-01')),
  getAPeriodBlock(uuid(), new Date('2025-04-01'), new Date('2025-05-01')),
];

describe('Edit Period Block Handler', () => {
  beforeAll(() => {
    periodBlockRepository = new PeriodBlockMockRepository();
    periodBlockGetter = getAPeriodBlockGetterMock();
    saveSpy = jest.spyOn(periodBlockRepository, 'save');
    getPeriodBlockSpy = jest.spyOn(periodBlockGetter, 'getByAdminUser');
    getPeriodBlockListSpy = jest.spyOn(
      periodBlockRepository,
      'getByAcademicPeriod',
    );
    handler = new EditPeriodBlockHandler(
      periodBlockGetter,
      periodBlockRepository,
    );
  });

  it('should throw a PeriodBlockInvalidException', async () => {
    getPeriodBlockSpy.mockImplementation((): Promise<PeriodBlock> => {
      return Promise.resolve(firstPeriodBlock);
    });
    getPeriodBlockListSpy.mockImplementation((): Promise<PeriodBlock[]> => {
      return Promise.resolve(periodBlockList);
    });

    await expect(async () => {
      await handler.handle(rightCommand);
    }).rejects.toThrow(PeriodBlockInvalidException);
  });

  it('should throw a PeriodBlockInvalidDateException', async () => {
    getPeriodBlockSpy.mockImplementation((): Promise<PeriodBlock> => {
      return Promise.resolve(secondPeriodBlock);
    });
    getPeriodBlockListSpy.mockImplementation((): Promise<PeriodBlock[]> => {
      return Promise.resolve(periodBlockList);
    });

    await expect(async () => {
      await handler.handle(wrongCommand);
    }).rejects.toThrow(PeriodBlockInvalidDateException);
  });

  it('Should edit a period block', async () => {
    getPeriodBlockSpy.mockImplementation((): Promise<PeriodBlock> => {
      return Promise.resolve(secondPeriodBlock);
    });
    getPeriodBlockListSpy.mockImplementation((): Promise<PeriodBlock[]> => {
      return Promise.resolve(periodBlockList);
    });

    await handler.handle(rightCommand);
    expect(saveSpy).toHaveBeenCalledTimes(2);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
