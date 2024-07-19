import {
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAnInternalGroup,
  getAPeriodBlock,
  getASubject,
} from '#test/entity-factory';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';

let service: InternalGroupGetter;
let repository: InternalGroupRepository;
let getByAdminUserSpy: jest.SpyInstance;

const internalGroup = getAnInternalGroup(
  getAnAcademicPeriod(),
  getAnAcademicProgram(),
  getAPeriodBlock(),
  getASubject(),
);
const adminUser = getAnAdminUser();

describe('Internal Group Getter Service', () => {
  beforeAll(() => {
    repository = new InternalGroupMockRepository();
    service = new InternalGroupGetter(repository);
    getByAdminUserSpy = jest.spyOn(repository, 'getByAdminUser');
  });

  it('should throw an InternalGroupNotFound exception', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<InternalGroup | null> => Promise.resolve(null),
    );

    await expect(
      service.getByAdminUser(internalGroup.id, adminUser),
    ).rejects.toThrow(InternalGroupNotFoundException);
  });

  it('should return an internal group', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<InternalGroup | null> => Promise.resolve(internalGroup),
    );

    const result = await service.getByAdminUser(internalGroup.id, adminUser);

    expect(result).toEqual(internalGroup);
  });
});
