import { CreateAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/create-administrative-group.controller';
import { GetAllAdministrativeGroupsController } from '#student/infrastructure/controller/administrative-group/get-all-administrative-groups/get-all-administrative-groups.controller';
import { SearchAdministrativeGroupsController } from '#student/infrastructure/controller/administrative-group/search-administrative-groups.controller';
import { GetAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/get-administrative-group/get-administrative-group.controller';
import { AddEdaeUserToAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/add-edae-user-to-administrative-group.controller';

export const administrativeGroupControllers = [
  CreateAdministrativeGroupController,
  GetAllAdministrativeGroupsController,
  SearchAdministrativeGroupsController,
  GetAdministrativeGroupController,
  AddEdaeUserToAdministrativeGroupController,
];
