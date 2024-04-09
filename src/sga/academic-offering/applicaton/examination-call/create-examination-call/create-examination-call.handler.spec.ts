import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { getABusinessUnit, getAnAcademicPeriod } from '#test/entity-factory';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { CreateExaminationCallHandler } from '#academic-offering/applicaton/examination-call/create-examination-call/create-examination-call.handler';
import { CreateExaminationCallCommand } from '#academic-offering/applicaton/examination-call/create-examination-call/create-examination-call.command';
import { ExaminationCallMockRepository } from '#test/mocks/sga/academic-offering/examination-call.mock-repository';
import { getAnAcademicPeriodGetterMock } from '#test/service-factory';
import { ExaminationCallDuplicatedException } from '#shared/domain/exception/academic-offering/examination-call.duplicated.exception';

let handler: CreateExaminationCallHandler;
let examinationCallMockRepository: ExaminationCallRepository;
let academicPeriodGetter: AcademicPeriodGetter;
let saveAcademicPeriodSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
const businessUnit = getABusinessUnit();
const academicPeriod = getAnAcademicPeriod();

academicPeriod.businessUnit = businessUnit;

const command = new CreateExaminationCallCommand(
  'b9a402f0-87c4-47f9-ad0b-d5b9a9d6087d',
  'Examen test',
  new Date(2024, 4, 13),
  new Date(2024, 4, 30),
  TimeZoneEnum.GMT_PLUS_1,
  academicPeriod.id,
  [businessUnit.id],
);

describe('CreateExaminationCallHandler', () => {
  beforeAll(() => {
    examinationCallMockRepository = new ExaminationCallMockRepository();

    academicPeriodGetter = getAnAcademicPeriodGetterMock();

    handler = new CreateExaminationCallHandler(
      examinationCallMockRepository,
      academicPeriodGetter,
    );

    saveAcademicPeriodSpy = jest.spyOn(examinationCallMockRepository, 'save');
    existsByIdSpy = jest.spyOn(examinationCallMockRepository, 'existsById');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'get');
  });

  it('should save a examination call', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    await handler.handle(command);
    expect(saveAcademicPeriodSpy).toHaveBeenCalledTimes(1);
    expect(saveAcademicPeriodSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.id,
        name: command.name,
        academicPeriod: academicPeriod,
      }),
    );
  });

  it('should throw an examinationCallDuplicatedException', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(true));
    expect(handler.handle(command)).rejects.toThrow(
      ExaminationCallDuplicatedException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
