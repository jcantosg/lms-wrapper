import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { getAnAcademicProgram } from '#test/entity-factory';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';

let service: AcademicProgramGetter;
let academicProgramRepository: AcademicProgramRepository;

let getUserSpy: any;

const academicProgram = getAnAcademicProgram();

describe('Academic Program Getter', () => {
  beforeAll(() => {
    academicProgramRepository = new AcademicProgramMockRepository();

    getUserSpy = jest.spyOn(academicProgramRepository, 'get');

    service = new AcademicProgramGetter(academicProgramRepository);
  });

  it('Should return an academic program', async () => {
    getUserSpy.mockImplementation((): Promise<AcademicProgram | null> => {
      return Promise.resolve(academicProgram);
    });

    const result = await service.get('academicProgramId');

    expect(result).toBe(academicProgram);
  });

  it('Should throw a AcademicProgramNotFoundException', async () => {
    getUserSpy.mockImplementation((): Promise<AcademicProgram | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('academicProgramId')).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
