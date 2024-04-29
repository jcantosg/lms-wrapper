import { GetAcademicProgramsPlainByPeriodHandler } from '#academic-offering/applicaton/academic-program/get-academic-programs-plain-by-period/get-academic-programs-plain-by-period.handler';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { GetAcademicProgramsPlainByPeriodQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-plain-by-period/get-academic-programs-plain-by-period.query';
import { getAnAcademicProgram, getAnAdminUser } from '#test/entity-factory';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';
import { getAnAcademicPeriodGetterMock } from '#test/service-factory';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

let handler: GetAcademicProgramsPlainByPeriodHandler;
let academicProgramRepository: AcademicProgramRepository;

let academicPeriodGetter: AcademicPeriodGetter;
let getByAdminUserSpy: jest.SpyInstance;
let getByAcademicPeriodSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
const academicProgram = getAnAcademicProgram();

const query = new GetAcademicProgramsPlainByPeriodQuery(
  '67b2659f-9745-476e-b4f5-fb8ae941d77c',
  adminUser,
);

describe('Get Academic Programs Plain By Period Handler', () => {
  beforeAll(() => {
    academicProgramRepository = new AcademicProgramMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    getByAcademicPeriodSpy = jest.spyOn(
      academicProgramRepository,
      'getByAcademicPeriod',
    );
    getByAdminUserSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');

    handler = new GetAcademicProgramsPlainByPeriodHandler(
      academicProgramRepository,
      academicPeriodGetter,
    );
  });

  it('should return academic programs', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicProgram[]> => Promise.resolve([academicProgram]),
    );

    await handler.handle(query);
    expect(getByAcademicPeriodSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
