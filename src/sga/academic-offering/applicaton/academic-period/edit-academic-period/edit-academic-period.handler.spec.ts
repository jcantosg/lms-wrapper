import { v4 as uuid } from 'uuid';
import { getAnAcademicPeriodGetterMock } from '#test/service-factory';
import {
  getAPeriodBlock,
  getAnAcademicPeriod,
  getAnAdminUser,
} from '#test/entity-factory';
import { EditAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { EditAcademicPeriodCommand } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.command';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlockMockRepository } from '#test/mocks/sga/academic-offering/period-block.mock-repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';

let handler: EditAcademicPeriodHandler;
let academicPeriodRepository: AcademicPeriodRepository;
let periodBlockRepository: PeriodBlockRepository;
let academicPeriodGetter: AcademicPeriodGetter;

let updateSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getPeriodBlocksSpy: jest.SpyInstance;
let savePeriodBlockSpy: jest.SpyInstance;

const command = new EditAcademicPeriodCommand(
  uuid(),
  'new name',
  'new code',
  new Date('2025-10-10'),
  new Date('2026-10-10'),
  getAnAdminUser(),
);

const periodBlock = getAPeriodBlock(
  new Date('2025-10-09'),
  new Date('2026-10-11'),
);

const academicPeriod = getAnAcademicPeriod(command.id);

describe('Edit Academic Period Handler', () => {
  beforeAll(() => {
    academicPeriodRepository = new AcademicPeriodMockRepository();
    periodBlockRepository = new PeriodBlockMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    updateSpy = jest.spyOn(academicPeriodRepository, 'update');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    getPeriodBlocksSpy = jest.spyOn(
      periodBlockRepository,
      'getByAcademicPeriod',
    );
    savePeriodBlockSpy = jest.spyOn(periodBlockRepository, 'save');
    handler = new EditAcademicPeriodHandler(
      academicPeriodGetter,
      academicPeriodRepository,
      periodBlockRepository,
    );
  });

  it('should throw an AcademicPeriodNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation((): Promise<AcademicPeriod> => {
      throw new AcademicPeriodNotFoundException();
    });
    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(AcademicPeriodNotFoundException);
  });

  it('Should edit an academic period', async () => {
    getAcademicPeriodSpy.mockImplementation(
      (): Promise<AcademicPeriod | null> => {
        return Promise.resolve(academicPeriod);
      },
    );
    getPeriodBlocksSpy.mockImplementation((): Promise<PeriodBlock[]> => {
      return Promise.resolve([periodBlock]);
    });
    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'new name',
        code: 'new code',
        startDate: new Date('2025-10-10'),
        endDate: new Date('2026-10-10'),
      }),
    );
    expect(savePeriodBlockSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
