import { AdminUserBusinessUnitsChecker } from './admin-user-business-units.checker.service';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import clearAllMocks = jest.clearAllMocks;

describe('AdminUserBusinessUnitsCheckerService', () => {
  let service: AdminUserBusinessUnitsChecker;
  const user = getAnAdminUser();
  const userToCompare = getAnAdminUser();
  const userToCompareWrongPath = getAnAdminUser();
  const businessUnit = getABusinessUnit();
  userToCompare.addBusinessUnit(businessUnit);
  user.addBusinessUnit(businessUnit);

  beforeAll(async () => {
    service = new AdminUserBusinessUnitsChecker();
  });

  it('should return nothing', () => {
    expect(() => {
      service.checkBusinessUnits(user, userToCompare);
    }).not.toThrow(AdminUserNotFoundException);
  });
  it('should throw an AdminUserNotFoundException', () => {
    expect(() => {
      service.checkBusinessUnits(user, userToCompareWrongPath);
    }).toThrow(AdminUserNotFoundException);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
