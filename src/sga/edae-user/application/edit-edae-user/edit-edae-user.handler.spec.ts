import { EditEdaeUserHandler } from '#edae-user/application/edit-edae-user/edit-edae-user.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import {
  getACountry,
  getAnAdminUser,
  getAnEdaeUser,
} from '#test/entity-factory';
import { EditEdaeUserCommand } from '#edae-user/application/edit-edae-user/edit-edae-user.command';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserMockRepository } from '#test/mocks/sga/edae-user/edae-user.mock-repository';
import {
  getCountryGetterMock,
  getEdaeUserBusinessUnitCheckerMock,
  getEdaeUserGetterMock,
  getImageUploaderMock,
} from '#test/service-factory';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';

let handler: EditEdaeUserHandler;
let repository: EdaeUserRepository;
let edaeUserGetter: EdaeUserGetter;
let imageUploader: ImageUploader;
let countryGetter: CountryGetter;
let edaeUserBusinessUnitChecker: EdaeUserBusinessUnitChecker;

let getEdaeUserSpy: jest.SpyInstance;
let getCountrySpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;
let checkBusinessUnits: jest.SpyInstance;

const edaeUser = getAnEdaeUser();
const country = getACountry();
const command = new EditEdaeUserCommand(
  edaeUser.id,
  'nombre',
  'surname1',
  getAnIdentityDocument().value,
  [EdaeRoles.COORDINADOR_FCT],
  TimeZoneEnum.GMT_PLUS_1,
  true,
  country.id,
  'surname2',
  null,
  getAnAdminUser(),
);

describe('Edit EDAE User Handler', () => {
  beforeAll(() => {
    repository = new EdaeUserMockRepository();
    edaeUserGetter = getEdaeUserGetterMock();
    imageUploader = getImageUploaderMock();
    countryGetter = getCountryGetterMock();
    edaeUserBusinessUnitChecker = getEdaeUserBusinessUnitCheckerMock();
    getEdaeUserSpy = jest.spyOn(edaeUserGetter, 'get');
    getCountrySpy = jest.spyOn(countryGetter, 'get');
    saveSpy = jest.spyOn(repository, 'save');
    checkBusinessUnits = jest.spyOn(
      edaeUserBusinessUnitChecker,
      'checkBusinessUnits',
    );
    handler = new EditEdaeUserHandler(
      repository,
      edaeUserGetter,
      imageUploader,
      countryGetter,
      edaeUserBusinessUnitChecker,
    );
  });
  it('should throw an EdaeUserNotFoundException', async () => {
    getEdaeUserSpy.mockImplementation((): Promise<EdaeUser> => {
      throw new EdaeUserNotFoundException();
    });
    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(EdaeUserNotFoundException);
  });
  it('should edit an EDAE user', async () => {
    getEdaeUserSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });
    getCountrySpy.mockImplementation((): Promise<Country> => {
      return Promise.resolve(country);
    });
    checkBusinessUnits.mockImplementation(() => {});
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: edaeUser.id,
        _name: command.name,
        _surname1: command.surname1,
        _roles: command.roles,
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
