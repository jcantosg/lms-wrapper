import { CreateAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/create-administrative-group.controller';
import { GetAllAdministrativeGroupsController } from '#student/infrastructure/controller/administrative-group/get-all-administrative-groups/get-all-administrative-groups.controller';
import { SearchAdministrativeGroupsController } from '#student/infrastructure/controller/administrative-group/search-administrative-groups.controller';
import { GetAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/get-administrative-group/get-administrative-group.controller';
import { AddEdaeUserToAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/add-edae-user-to-administrative-group.controller';
import { RemoveEdaeUserFromAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/remove-edae-user-from-administrative-group.controller';
import { GetAdministrativeGroupByAcademicProgramController } from '#student/infrastructure/controller/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.controller';
import { MoveStudentFromAdministrativeGroupController } from '#student/infrastructure/controller/administrative-group/move-student-from-administrative-group/move-student-from-administrative-group.controller';

export const administrativeGroupControllers = [
  CreateAdministrativeGroupController,
  SearchAdministrativeGroupsController,
  AddEdaeUserToAdministrativeGroupController,
  RemoveEdaeUserFromAdministrativeGroupController,
  GetAdministrativeGroupByAcademicProgramController,
  GetAdministrativeGroupController,
  GetAllAdministrativeGroupsController,
  MoveStudentFromAdministrativeGroupController,
];
