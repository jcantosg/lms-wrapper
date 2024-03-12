import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { getABusinessUnit, getAnEvaluationType } from '#test/entity-factory';
import { EvaluationTypeNotFoundException } from '#shared/domain/exception/academic-offering/evaluation-type.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let service: EvaluationTypeBusinessUnitChecker;
const businessUnit = getABusinessUnit();
const evaluationType = getAnEvaluationType();
let checkSpy: jest.SpyInstance;

describe('Evaluation Type Business Unit Checker Service Unit Test', () => {
  beforeAll(() => {
    service = new EvaluationTypeBusinessUnitChecker();
    checkSpy = jest.spyOn(service, 'checkEvaluationTypeBusinessUnit');
  });
  it('should return nothing', () => {
    evaluationType.businessUnits.push(businessUnit);
    service.checkEvaluationTypeBusinessUnit(evaluationType, [businessUnit]);
    expect(checkSpy).toHaveBeenCalledTimes(1);
  });
  it('should throw an EvaluationTypeException', () => {
    expect(() => {
      service.checkEvaluationTypeBusinessUnit(evaluationType, [
        getABusinessUnit(),
      ]);
    }).toThrow(EvaluationTypeNotFoundException);
  });
  afterAll(() => {
    clearAllMocks();
  });
});
