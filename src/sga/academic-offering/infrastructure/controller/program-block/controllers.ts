import { CreateProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/create-program-block.controller';
import { GetAllProgramBlockStructureTypesController } from '#academic-offering/infrastructure/controller/program-block/get-all-program-block-structure-types.controller';

export const programBlockControllers = [
  GetAllProgramBlockStructureTypesController,
  CreateProgramBlockController,
];
