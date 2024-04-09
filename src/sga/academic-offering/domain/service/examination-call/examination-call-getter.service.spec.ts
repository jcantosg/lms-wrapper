import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call/examination-call-getter.service';
import { ExaminationCallNotFoundException } from '#shared/domain/exception/academic-offering/examination-call.not-found.exception';
import { getAnExaminationCall } from '#test/entity-factory';
import { ExaminationCallMockRepository } from '#test/mocks/sga/academic-offering/examination-call.mock-repository';

let service: ExaminationCallGetter;
let examinationCallRepository: ExaminationCallRepository;

let getExaminationCallSpy: any;

const examinationCall = getAnExaminationCall();

describe('ExaminationCall Getter', () => {
  beforeAll(() => {
    examinationCallRepository = new ExaminationCallMockRepository();

    getExaminationCallSpy = jest.spyOn(examinationCallRepository, 'get');

    service = new ExaminationCallGetter(examinationCallRepository);
  });

  it('Should return an examination call', async () => {
    getExaminationCallSpy.mockImplementation(
      (): Promise<ExaminationCall | null> => {
        return Promise.resolve(examinationCall);
      },
    );

    const result = await service.get('examinationCallId');

    expect(result).toBe(examinationCall);
  });

  it('Should throw a ExaminationCallNotFoundException', async () => {
    getExaminationCallSpy.mockImplementation(
      (): Promise<ExaminationCall | null> => {
        return Promise.resolve(null);
      },
    );

    await expect(service.get('examinationCallId')).rejects.toThrow(
      ExaminationCallNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
