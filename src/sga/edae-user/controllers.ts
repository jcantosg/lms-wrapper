import { CreateEdaeUserController } from '#/sga/edae-user/infrastructure/controller/create-edae-user.controller';
import { GetTimezonesController } from './infrastructure/controller/get-all-timezones.controller';
import { GetEdaeRolesController } from './infrastructure/controller/get-all-edae-users-roles.controller';
import { AddBusinessUnitsToEdaeUserController } from '#edae-user/infrastructure/controller/add-business-units-to-edae-user.controller';
import { GetAllEdaeUsersController } from '#edae-user/infrastructure/controller/get-all-edae-users/get-all-edae-users.controller';
import { RemoveBusinessUnitsFromEdaeUserController } from '#edae-user/infrastructure/controller/remove-business-units-from-edae-user.controller';
import { SearchEdaeUsersController } from '#edae-user/infrastructure/controller/search-edae-users/search-edae-users.controller';
import { EditEdaeUserController } from '#edae-user/infrastructure/controller/edit-edae-user.controller';

export const controllers = [
  CreateEdaeUserController,
  GetEdaeRolesController,
  GetTimezonesController,
  SearchEdaeUsersController,
  GetAllEdaeUsersController,
  EditEdaeUserController,
  RemoveBusinessUnitsFromEdaeUserController,
  AddBusinessUnitsToEdaeUserController,
];