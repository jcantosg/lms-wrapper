import { EditEdaeUserHandler } from '#edae-user/application/edit-edae-user/edit-edae-user.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { SearchEdaeUsersHandler } from '#edae-user/application/search-edae-users/search-edae-users.handler';
import { RemoveBusinessUnitsFromEdaeUserHandler } from '#edae-user/application/remove-business-units-from-edae-user/remove-business-units-from-edae-user.handler';
import { AddBusinessUnitsToEdaeUserHandler } from '#edae-user/application/add-business-units-to-edae-user/add-business-units-to-edae-user.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { GetAllEdaeUsersHandler } from '#edae-user/application/get-all-edae-users/get-all-edae-users.handler';
import { CreateEdaeUserHandler } from '#edae-user/application/edae-user/create-edae-user/create-edae-user.handler';

const createEdaeUserHandler = {
  provide: CreateEdaeUserHandler,
  useFactory: (
    repository: EdaeUserRepository,
    businessUnitGetter: BusinessUnitGetter,
    countryGetter: CountryGetter,
  ) => {
    return new CreateEdaeUserHandler(
      repository,
      businessUnitGetter,
      countryGetter,
    );
  },
  inject: [EdaeUserRepository, BusinessUnitGetter, CountryGetter],
};

const getAllEdaeUsersHandler = {
  provide: GetAllEdaeUsersHandler,
  useFactory: (
    repository: EdaeUserRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new GetAllEdaeUsersHandler(repository, businessUnitGetter);
  },
  inject: [EdaeUserRepository, BusinessUnitGetter],
};

const searchEdaeUserHandler = {
  provide: SearchEdaeUsersHandler,
  useFactory: (
    repository: EdaeUserRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new SearchEdaeUsersHandler(repository, businessUnitGetter);
  },
  inject: [EdaeUserRepository, BusinessUnitGetter],
};

const editEdaeUserHandler = {
  provide: EditEdaeUserHandler,
  useFactory: (
    repository: EdaeUserRepository,
    edaeUserGetter: EdaeUserGetter,
    imageUploader: ImageUploader,
    countryGetter: CountryGetter,
    edaeUserBusinessUnitGetter: EdaeUserBusinessUnitChecker,
  ) => {
    return new EditEdaeUserHandler(
      repository,
      edaeUserGetter,
      imageUploader,
      countryGetter,
      edaeUserBusinessUnitGetter,
    );
  },
  inject: [
    EdaeUserRepository,
    EdaeUserGetter,
    ImageUploader,
    CountryGetter,
    EdaeUserBusinessUnitChecker,
  ],
};

const removeBusinessUnitsFromEdaeUserHandler = {
  provide: RemoveBusinessUnitsFromEdaeUserHandler,
  useFactory: (
    edaeUserRepository: EdaeUserRepository,
    businessUnitGetter: BusinessUnitGetter,
    edaeUserGetter: EdaeUserGetter,
  ) => {
    return new RemoveBusinessUnitsFromEdaeUserHandler(
      edaeUserRepository,
      businessUnitGetter,
      edaeUserGetter,
    );
  },
  inject: [EdaeUserRepository, BusinessUnitGetter, EdaeUserGetter],
};

const addBusinessUnitsToEdaeUserHandler = {
  provide: AddBusinessUnitsToEdaeUserHandler,
  useFactory: (
    edaeUserRepository: EdaeUserRepository,
    businessUnitGetter: BusinessUnitGetter,
    edaeUserGetter: EdaeUserGetter,
  ) => {
    return new AddBusinessUnitsToEdaeUserHandler(
      edaeUserRepository,
      businessUnitGetter,
      edaeUserGetter,
    );
  },
  inject: [EdaeUserRepository, BusinessUnitGetter, EdaeUserGetter],
};

export const handlers = [
  getAllEdaeUsersHandler,
  searchEdaeUserHandler,
  removeBusinessUnitsFromEdaeUserHandler,
  addBusinessUnitsToEdaeUserHandler,
  editEdaeUserHandler,
  createEdaeUserHandler,
];
