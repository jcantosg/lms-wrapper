import { CreateBusinessUnitController } from '#business-unit/infrastructure/controller/create-business-unit.controller';
import { EditBusinessUnitController } from '#business-unit/infrastructure/controller/edit-business-unit.controller';
import { GetAllBusinessController } from '#business-unit/infrastructure/controller/get-all-business-units/get-all-business-units.controller';
import { GetBusinessUnitController } from '#business-unit/infrastructure/controller/get-business-unit/get-business-unit.controller';
import { SearchBusinessUnitsController } from '#business-unit/infrastructure/controller/search-business-units.controller';
import { CreateVirtualCampusController } from '#business-unit/infrastructure/controller/create-virtual-campus.controller';

export const controllers = [
  SearchBusinessUnitsController,
  CreateBusinessUnitController,
  EditBusinessUnitController,
  GetAllBusinessController,
  GetBusinessUnitController,
  CreateVirtualCampusController,
];
