import { CreateAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/create-administrative-group.controller';
import { GetAllAdministrativeGroupsController } from '#student/infrastructure/controller/administrative-group/get-all-administrative-groups/get-all-administrative-groups.controller';
import { SearchAdministrativeGroupsController } from '#student/infrastructure/controller/administrative-group/search-administrative-groups.controller';

export const administrativeGroupControllers = [
  CreateAdministrativeGroupController,
  GetAllAdministrativeGroupsController,
  SearchAdministrativeGroupsController,
];
