import { CreateProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/create-program-block.controller';
import { GetAllProgramBlockStructureTypesController } from '#academic-offering/infrastructure/controller/program-block/get-all-program-block-structure-types.controller';
import { EditProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/edit-program-block.controller';

export const programBlockControllers = [
  GetAllProgramBlockStructureTypesController,
  CreateProgramBlockController,
  EditProgramBlockController,
];
