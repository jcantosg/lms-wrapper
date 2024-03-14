import { v4 as uuid } from 'uuid';
import { getAnAcademicPeriodGetterMock } from '#test/service-factory';
import { getABusinessUnit, getAnAcademicPeriod } from '#test/entity-factory';
import { EditAcademicPeriodHandler } from '#academic-offering/applicaton/edit-academic-period/edit-academic-period.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { EditAcademicPeriodCommand } from '#academic-offering/applicaton/edit-academic-period/edit-academic-period.command';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';

let handler: EditAcademicPeriodHandler;
let academicPeriodRepository: AcademicPeriodRepository;
let academicPeriodGetter: AcademicPeriodGetter;

let updateSpy: any;
let getAcademicPeriodSpy: any;

const businessUnit = getABusinessUnit();
const command = new EditAcademicPeriodCommand(
  uuid(),
  'new name',
  'new code',
  new Date('2025-10-10'),
  new Date('2026-10-10'),
  [businessUnit.id],
  true,
);

const academicPeriod = getAnAcademicPeriod(command.id);

describe('Edit Academic Period Handler', () => {
  beforeAll(() => {
    academicPeriodRepository = new AcademicPeriodMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    updateSpy = jest.spyOn(academicPeriodRepository, 'update');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    handler = new EditAcademicPeriodHandler(
      academicPeriodGetter,
      academicPeriodRepository,
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
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
