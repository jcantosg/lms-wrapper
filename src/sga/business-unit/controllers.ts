import { CreateBusinessUnitController } from '#business-unit/infrastructure/controller/create-business-unit.controller';
import { EditBusinessUnitController } from '#business-unit/infrastructure/controller/edit-business-unit.controller';
import { GetBusinessUnitController } from '#business-unit/infrastructure/controller/get-business-unit/get-business-unit.controller';

export const controllers = [
  CreateBusinessUnitController,
  EditBusinessUnitController,
  GetBusinessUnitController,
];
