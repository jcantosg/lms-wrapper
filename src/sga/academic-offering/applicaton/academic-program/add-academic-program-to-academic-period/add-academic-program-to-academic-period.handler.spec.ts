import { v4 as uuid } from 'uuid';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import {
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
} from '#test/entity-factory';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import {
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
} from '#test/service-factory';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AddAcademicProgramToAcademicPeriodCommand } from '#academic-offering/applicaton/academic-program/add-academic-program-to-academic-period/add-academic-program-to-academic-period.command';
import { AddAcademicProgramToAcademicPeriodHandler } from '#academic-offering/applicaton/academic-program/add-academic-program-to-academic-period/add-academic-program-to-academic-period.handler';

let handler: AddAcademicProgramToAcademicPeriodHandler;
let academicPeriodRepository: AcademicPeriodRepository;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;

let getAcademicPeriodByAdminUserSpy: any;
let getAcademicProgramByAdminUserSpy: any;
let updateSpy: any;

const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const user = getAnAdminUser();

const command = new AddAcademicProgramToAcademicPeriodCommand(
  uuid(),
  academicProgram.id,
  user,
);

describe('Add Academic Programs to Academic Period', () => {
  beforeAll(() => {
    academicPeriodRepository = new AcademicPeriodMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();

    getAcademicPeriodByAdminUserSpy = jest.spyOn(
      academicPeriodGetter,
      'getByAdminUser',
    );
    getAcademicProgramByAdminUserSpy = jest.spyOn(
      academicProgramGetter,
      'getByAdminUser',
    );
    updateSpy = jest.spyOn(academicPeriodRepository, 'save');

    handler = new AddAcademicProgramToAcademicPeriodHandler(
      academicPeriodRepository,
      academicPeriodGetter,
      academicProgramGetter,
    );
  });

  it('should throw a academic program not found 404', async () => {
    getAcademicPeriodByAdminUserSpy.mockImplementation(() => {
      return Promise.resolve(academicPeriod);
    });
    getAcademicProgramByAdminUserSpy.mockImplementation(() => {
      return Promise.resolve(academicProgram);
    });

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should add academic program to academic period', async () => {
    academicProgram.businessUnit = academicPeriod.businessUnit;
    academicPeriod.businessUnit = academicProgram.businessUnit;

    getAcademicPeriodByAdminUserSpy.mockImplementation(() => {
      return Promise.resolve(academicPeriod);
    });
    getAcademicProgramByAdminUserSpy.mockImplementation(() => {
      return Promise.resolve(academicProgram);
    });

    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
