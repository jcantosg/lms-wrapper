import { GetAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/get-academic-period/get-academic-period.handler';
import { GetAcademicPeriodQuery } from '#academic-offering/applicaton/academic-period/get-academic-period/get-academic-period.query';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { getAnAcademicPeriod } from '#test/entity-factory';
import { getAnAcademicPeriodGetterMock } from '#test/service-factory';

let handler: GetAcademicPeriodHandler;
let academicPeriodGetter: AcademicPeriodGetter;
let getSpy: any;
const academicPeriod = getAnAcademicPeriod();
const query = new GetAcademicPeriodQuery(
  academicPeriod.id,
  [academicPeriod.businessUnit.id],
  true,
);

describe('Get Academic Period Handler', () => {
  beforeAll(() => {
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    handler = new GetAcademicPeriodHandler(academicPeriodGetter);
    getSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
  });

  it('should return an academic period', async () => {
    getSpy.mockImplementation((): Promise<AcademicPeriod> => {
      return Promise.resolve(academicPeriod);
    });
    const newAcademicPeriod = await handler.handle(query);
    expect(newAcademicPeriod).toEqual(academicPeriod);
  });

  it('should throw an AcademicPeriodNotFoundException', async () => {
    getSpy.mockImplementation(() => {
      throw new AcademicPeriodNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });
});
