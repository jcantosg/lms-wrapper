import {
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
} from '#test/service-factory';
import {
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
} from '#test/entity-factory';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { RemoveAcademicProgramFromAcademicPeriodHandler } from '#academic-offering/applicaton/remove-academic-program-from-academic-period/remove-academic-program-from-academic-period.handler';
import { RemoveAcademicProgramFromAcademicPeriodCommand } from '#academic-offering/applicaton/remove-academic-program-from-academic-period/remove-academic-program-from-academic-period.command';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';

let handler: RemoveAcademicProgramFromAcademicPeriodHandler;
let academicPeriodRepository: AcademicPeriodRepository;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;

let updateSpy: any;
let getAcademicPeriodSpy: any;
let getAcademicProgramSpy: any;

const adminUser = getAnAdminUser();
const academicProgram = getAnAcademicProgram();
const academicPeriod = getAnAcademicPeriod();

const command = new RemoveAcademicProgramFromAcademicPeriodCommand(
  academicPeriod.id,
  academicProgram.id,
  adminUser,
);

describe('Remove Academic Program from Academic Period Handler', () => {
  beforeAll(() => {
    academicPeriodRepository = new AcademicPeriodMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    updateSpy = jest.spyOn(academicPeriodRepository, 'update');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');

    handler = new RemoveAcademicProgramFromAcademicPeriodHandler(
      academicPeriodGetter,
      academicProgramGetter,
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

  it('should throw an AcademicProgramNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation((): Promise<AcademicPeriod> => {
      return Promise.resolve(academicPeriod);
    });
    getAcademicProgramSpy.mockImplementation((): Promise<AcademicProgram> => {
      throw new AcademicProgramNotFoundException();
    });
    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(AcademicProgramNotFoundException);
  });

  it('Should remove an academic program from an academic period', async () => {
    getAcademicPeriodSpy.mockImplementation(
      (): Promise<AcademicPeriod | null> => {
        return Promise.resolve(academicPeriod);
      },
    );
    getAcademicProgramSpy.mockImplementation(
      (): Promise<AcademicProgram | null> => {
        return Promise.resolve(academicProgram);
      },
    );

    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        academicPrograms: [],
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
