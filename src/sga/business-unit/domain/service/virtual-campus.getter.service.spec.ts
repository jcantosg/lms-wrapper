import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { getAVirtualCampus } from '#test/entity-factory';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { VirtualCampusNotFoundException } from '#shared/domain/exception/business-unit/virtual-campus-not-found.exception';

let virtualCampusRepository: VirtualCampusRepository;
let service: VirtualCampusGetter;
let getByIdSpy: any;
const virtualCampus = getAVirtualCampus('f1d43489-efe6-4695-9529-43de26740219');

describe('Virtual Campus Getter Service', () => {
  beforeAll(() => {
    virtualCampusRepository = new VirtualCampusMockRepository();
    service = new VirtualCampusGetter(virtualCampusRepository);
    getByIdSpy = jest.spyOn(virtualCampusRepository, 'get');
  });

  it('should get a virtual campus', async () => {
    getByIdSpy.mockImplementation((): Promise<VirtualCampus | null> => {
      return Promise.resolve(virtualCampus);
    });
    const getVirtualCampus = await service.get(
      'f1d43489-efe6-4695-9529-43de26740219',
    );
    expect(getByIdSpy).toHaveBeenCalledTimes(1);
    expect(getVirtualCampus).toEqual(virtualCampus);
  });

  it('should throw a virtual campus not found exception', () => {
    getByIdSpy.mockImplementation((): Promise<VirtualCampus | null> => {
      return Promise.resolve(null);
    });
    expect(service.get('f1d43489-efe6-4695-9529-43de26740219')).rejects.toThrow(
      VirtualCampusNotFoundException,
    );
  });
});
