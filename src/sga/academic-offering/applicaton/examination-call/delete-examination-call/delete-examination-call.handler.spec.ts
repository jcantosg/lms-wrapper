import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call/examination-call-getter.service';
import { getABusinessUnit, getAnExaminationCall } from '#test/entity-factory';
import { ExaminationCallMockRepository } from '#test/mocks/sga/academic-offering/examination-call.mock-repository';
import { getAnExaminationCallGetterMock } from '#test/service-factory';
import { DeleteExaminationCallHandler } from '#academic-offering/applicaton/examination-call/delete-examination-call/delete-examination-call.handler';
import { DeleteExaminationCallCommand } from '#academic-offering/applicaton/examination-call/delete-examination-call/delete-examination-call.command';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { ExaminationCallNotFoundException } from '#shared/domain/exception/academic-offering/examination-call.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: DeleteExaminationCallHandler;
let repository: ExaminationCallRepository;
let examinationCallGetter: ExaminationCallGetter;

let deleteSpy: jest.SpyInstance;
let getSpy: jest.SpyInstance;

const examinationCall = getAnExaminationCall();
const businessUnit = getABusinessUnit();
examinationCall.academicPeriod.businessUnit = businessUnit;

const command = new DeleteExaminationCallCommand(
  examinationCall.id,
  [businessUnit.id],
  false,
);

describe('Delete Examination Call Handler', () => {
  beforeAll(() => {
    repository = new ExaminationCallMockRepository();
    examinationCallGetter = getAnExaminationCallGetterMock();
    handler = new DeleteExaminationCallHandler(
      repository,
      examinationCallGetter,
    );

    deleteSpy = jest.spyOn(repository, 'delete');
    getSpy = jest.spyOn(examinationCallGetter, 'getByAdminUser');
  });
  it('should remove an examination call', async () => {
    getSpy.mockImplementation(
      (): Promise<ExaminationCall> => Promise.resolve(examinationCall),
    );
    await handler.handle(command);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: examinationCall.id,
        name: examinationCall.name,
        academicPeriod: examinationCall.academicPeriod,
        endDate: examinationCall.endDate,
        startDate: examinationCall.startDate,
      }),
    );
  });
  /*@TODO add test checking it has student relations */
  it('should return ExaminationCallNotFoundException', async () => {
    getSpy.mockImplementation((): Promise<ExaminationCall> => {
      throw new ExaminationCallNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCallNotFoundException,
    );
  });

  afterAll(() => clearAllMocks());
});
