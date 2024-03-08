import { CreateEdaeUserHandler } from './create-edae-user.handler';
import { CreateEdaeUserCommand } from './create-edae-user.command';
import { EdaeUserMockRepository } from '#test/mocks/sga/edae-user/edae-user.mock-repository';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnitMockRepository } from '#test/mocks/sga/business-unit/business-unit.mock-repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { CountryMockRepository } from '#test/mocks/shared/country.mock-repository';
import { EdaeUserDuplicatedException } from '#shared/domain/exception/edae-user/edae-user-duplicated.exception';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { getImageUploaderMock } from '#test/service-factory';

let businessUnitGetter: BusinessUnitGetter;
let businessUnitMockRepository: BusinessUnitMockRepository;
let countryGetter: CountryGetter;
let countryMockRepository: CountryMockRepository;
let imageUploader: ImageUploader;

let uploadImageSpy: jest.SpyInstance;

const command = new CreateEdaeUserCommand(
  'id',
  'name',
  'surname1',
  'surname2',
  'email@example.com',
  {
    identityDocumentType: IdentityDocumentType.DNI,
    identityDocumentNumber: '74700994F',
  },
  [EdaeRoles.DOCENTE],
  ['businessUnit'],
  ['adminUserBusinessUnit'],
  TimeZoneEnum.GMT_PLUS_1,
  true,
  'location',
  'avatar',
);

describe('CreateEdaeUserHandler', () => {
  let handler: CreateEdaeUserHandler;
  let mockRepository: EdaeUserMockRepository;

  beforeEach(() => {
    mockRepository = new EdaeUserMockRepository();
    businessUnitMockRepository = new BusinessUnitMockRepository();
    countryMockRepository = new CountryMockRepository();
    countryGetter = new CountryGetter(countryMockRepository);
    imageUploader = getImageUploaderMock();
    uploadImageSpy = jest.spyOn(imageUploader, 'uploadImage');

    businessUnitMockRepository.get.mockResolvedValue({});

    businessUnitGetter = new BusinessUnitGetter(businessUnitMockRepository);
    handler = new CreateEdaeUserHandler(
      mockRepository,
      businessUnitGetter,
      countryGetter,
      imageUploader,
    );
  });

  it('Should throw duplicated exception when id already exists', async () => {
    jest.spyOn(mockRepository, 'existsById').mockResolvedValue(true);

    await expect(handler.handle(command)).rejects.toThrow(
      EdaeUserDuplicatedException,
    );
  });

  it('Should throw duplicated exception when email already exists', async () => {
    jest.spyOn(mockRepository, 'existsByEmail').mockResolvedValue(true);

    await expect(handler.handle(command)).rejects.toThrow(
      EdaeUserDuplicatedException,
    );
  });

  it('Should successfully create an EdaeUser', async () => {
    jest.spyOn(mockRepository, 'existsById').mockResolvedValue(false);
    jest.spyOn(mockRepository, 'existsByEmail').mockResolvedValue(false);
    uploadImageSpy.mockImplementation(
      (): Promise<string> => Promise.resolve('avatar'),
    );

    const mockBusinessUnit = { id: 'businessUnit', name: 'Test Unit' };
    businessUnitMockRepository.getByAdminUser.mockResolvedValue(
      mockBusinessUnit,
    );

    const mockLocation = { id: 'location', name: 'Test Location' };
    countryMockRepository.get.mockResolvedValue(mockLocation);

    const saveSpy = jest
      .spyOn(mockRepository, 'save')
      .mockResolvedValue(undefined);

    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
