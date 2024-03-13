import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { getAnAcademicPeriod } from '#test/entity-factory';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';

let service: AcademicPeriodGetter;
let academicPeriodRepository: AcademicPeriodRepository;

let getUserSpy: any;

const academicPeriod = getAnAcademicPeriod();

describe('Edae User Getter', () => {
  beforeAll(() => {
    academicPeriodRepository = new AcademicPeriodMockRepository();

    getUserSpy = jest.spyOn(academicPeriodRepository, 'get');

    service = new AcademicPeriodGetter(academicPeriodRepository);
  });

  it('Should return an academic period', async () => {
    getUserSpy.mockImplementation((): Promise<AcademicPeriod | null> => {
      return Promise.resolve(academicPeriod);
    });

    const result = await service.get('academicPeriodId');

    expect(result).toBe(academicPeriod);
  });

  it('Should throw a AcademicPeriodNotFoundException', async () => {
    getUserSpy.mockImplementation((): Promise<AcademicPeriod | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('academicPeriodId')).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
