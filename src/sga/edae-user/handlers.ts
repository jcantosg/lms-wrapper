import { GetAllEdaeUsersHandler } from '#edae-user/application/get-all-edae-users/get-all-edae-users.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { SearchEdaeUsersHandler } from '#edae-user/application/search-edae-users/search-edae-users.handler';

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
export const handlers = [getAllEdaeUsersHandler, searchEdaeUserHandler];
