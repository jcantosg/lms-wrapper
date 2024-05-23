import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { getAnAdministrativeGroup, getAnAdminUser } from '#test/entity-factory';
import { AdministrativeGroupMockRepository } from '#test/mocks/sga/student/administrative-group.mock-repository';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';

let service: AdministrativeGroupGetter;
let repository: AdministrativeGroupRepository;
let getByAdminUserSpy: jest.SpyInstance;

const administrativeGroup = getAnAdministrativeGroup();
const adminUser = getAnAdminUser();

describe('Administrative Group Getter Service', () => {
  beforeAll(() => {
    repository = new AdministrativeGroupMockRepository();
    service = new AdministrativeGroupGetter(repository);
    getByAdminUserSpy = jest.spyOn(repository, 'getByAdminUser');
  });

  it('should throw an AdministrativeGroupNotFound exception', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AdministrativeGroup | null> => Promise.resolve(null),
    );

    await expect(
      service.getByAdminUser(administrativeGroup.id, adminUser),
    ).rejects.toThrow(AdministrativeGroupNotFoundException);
  });

  it('should return an administrative group', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AdministrativeGroup | null> =>
        Promise.resolve(administrativeGroup),
    );

    const result = await service.getByAdminUser(
      administrativeGroup.id,
      adminUser,
    );

    expect(result).toEqual(administrativeGroup);
  });
});
