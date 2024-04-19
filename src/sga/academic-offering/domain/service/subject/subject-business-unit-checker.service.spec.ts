import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject/subject-business-unit-checker.service';
import { getABusinessUnit, getASubject } from '#test/entity-factory';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let service: SubjectBusinessUnitChecker;
const businessUnit = getABusinessUnit();
const subject = getASubject();
let checkSpy: jest.SpyInstance;

describe('Subject Business Unit Checker Service Unit Testing', () => {
  beforeAll(() => {
    service = new SubjectBusinessUnitChecker();
    checkSpy = jest.spyOn(service, 'checkSubjectBusinessUnit');
  });
  it('should return nothing', () => {
    subject.businessUnit = businessUnit;
    service.checkSubjectBusinessUnit(subject, [businessUnit]);
    expect(checkSpy).toHaveBeenCalledTimes(1);
  });
  it('should throw a SubjectNotFoundException', () => {
    subject.businessUnit = getABusinessUnit();
    expect(() => {
      service.checkSubjectBusinessUnit(subject, [businessUnit]);
    }).toThrow(SubjectNotFoundException);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
