import { AddBusinessUnitsToEdaeUserController } from '#edae-user/infrastructure/controller/add-business-units-to-edae-user.controller';
import { GetAllEdaeUsersController } from '#edae-user/infrastructure/controller/get-all-edae-users/get-all-edae-users.controller';
import { SearchEdaeUsersController } from '#edae-user/infrastructure/controller/search-edae-users/search-edae-users.controller';

export const controllers = [
  SearchEdaeUsersController,
  GetAllEdaeUsersController,
  AddBusinessUnitsToEdaeUserController,
];
