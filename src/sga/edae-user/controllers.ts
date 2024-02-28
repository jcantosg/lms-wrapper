import { AddBusinessUnitsToEdaeUserController } from '#edae-user/infrastructure/controller/add-business-units-to-edae-user.controller';
import { GetAllEdaeUsersController } from '#edae-user/infrastructure/controller/get-all-edae-users/get-all-edae-users.controller';
import { RemoveBusinessUnitsFromEdaeUserController } from '#edae-user/infrastructure/controller/remove-business-units-from-edae-user.controller';
import { SearchEdaeUsersController } from '#edae-user/infrastructure/controller/search-edae-users/search-edae-users.controller';

export const controllers = [
  SearchEdaeUsersController,
  GetAllEdaeUsersController,
  RemoveBusinessUnitsFromEdaeUserController,
  AddBusinessUnitsToEdaeUserController,
];
