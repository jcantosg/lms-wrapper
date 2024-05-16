import { GetSubjectsByBusinessUnitHandler } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import {
  getABusinessUnit,
  getAnAcademicProgram,
  getAnAdminUser,
  getASubject,
} from '#test/entity-factory';
import { GetSubjectsByBusinessUnitQuery } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.query';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import clearAllMocks = jest.clearAllMocks;

let handler: GetSubjectsByBusinessUnitHandler;
let repository: SubjectRepository;

let getByBusinessUnitSpy: jest.SpyInstance;
const subjectResponse = [getASubject(), getASubject()];
const adminUser = getAnAdminUser();
adminUser.businessUnits = [getABusinessUnit()];
const query = new GetSubjectsByBusinessUnitQuery(
  adminUser.businessUnits[0].id,
  getAnAcademicProgram().id,
  adminUser,
);

describe('Get Subjects By Business Unit Handler', () => {
  beforeAll(async () => {
    repository = new SubjectMockRepository();
    handler = new GetSubjectsByBusinessUnitHandler(repository);
    getByBusinessUnitSpy = jest.spyOn(repository, 'getByBusinessUnit');
  });
  it('should return a subject array', async () => {
    getByBusinessUnitSpy.mockImplementation(() =>
      Promise.resolve(subjectResponse),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(subjectResponse);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
