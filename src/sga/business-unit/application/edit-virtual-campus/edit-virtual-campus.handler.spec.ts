import { v4 as uuid } from 'uuid';
import { EditVirtualCampusHandler } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.handler';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { EditVirtualCampusCommand } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.command';
import { getAVirtualCampus, getAnAdminUser } from '#test/entity-factory';
import { getVirtualCampusGetterMock } from '#test/service-factory';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

let handler: EditVirtualCampusHandler;
let virtualCampusRepository: VirtualCampusRepository;
let virtualCampusGetter: VirtualCampusGetter;

let updateSpy: any;
let getVirtualCampusSpy: any;

const user = getAnAdminUser();
const command = new EditVirtualCampusCommand(
  uuid(),
  'name',
  'code',
  user,
  true,
);

const virtualCampus = getAVirtualCampus(command.id);

user.addBusinessUnit(virtualCampus.businessUnit);

describe('Edit Virtual Campus Handler', () => {
  beforeAll(() => {
    virtualCampusRepository = new VirtualCampusMockRepository();
    virtualCampusGetter = getVirtualCampusGetterMock();

    getVirtualCampusSpy = jest.spyOn(virtualCampusGetter, 'get');
    updateSpy = jest.spyOn(virtualCampusRepository, 'update');
    handler = new EditVirtualCampusHandler(
      virtualCampusRepository,
      virtualCampusGetter,
    );
  });

  it('should edit a virtual campus', async () => {
    getVirtualCampusSpy.mockImplementation(
      (): Promise<VirtualCampus | null> => {
        return Promise.resolve(virtualCampus);
      },
    );
    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
