import { GetAcademicPeriodsByBusinessUnitHandler } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { GetAcademicPeriodsByBusinessUnitQuery } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.query';
import {
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAdminUser,
} from '#test/entity-factory';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

let handler: GetAcademicPeriodsByBusinessUnitHandler;
let academicPeriodRepository: AcademicPeriodRepository;
let getByBusinessUnitSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit('b29b9b2a-9f86-40a7-926a-38b4b8eb4d01');
const adminUser = getAnAdminUser();
const academicPeriod = getAnAcademicPeriod();

const query = new GetAcademicPeriodsByBusinessUnitQuery(
  businessUnit.id,
  adminUser,
);

describe('Get Academic Periods By Business Unit Handler', () => {
  beforeAll(() => {
    academicPeriodRepository = new AcademicPeriodMockRepository();
    getByBusinessUnitSpy = jest.spyOn(
      academicPeriodRepository,
      'getByBusinessUnit',
    );
    handler = new GetAcademicPeriodsByBusinessUnitHandler(
      academicPeriodRepository,
    );
  });

  it('should return 404 if the business unit is not found', async () => {
    await expect(handler.handle(query)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });

  it('should return academic periods', async () => {
    adminUser.businessUnits.push(businessUnit);
    getByBusinessUnitSpy.mockImplementation(() => {
      return Promise.resolve([academicPeriod]);
    });

    const academicPeriods = await handler.handle(query);
    expect(getByBusinessUnitSpy).toHaveBeenCalledTimes(1);
    expect(academicPeriods).toEqual([academicPeriod]);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
