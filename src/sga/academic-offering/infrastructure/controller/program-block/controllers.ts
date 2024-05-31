import { CreateProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/create-program-block.controller';
import { GetAllProgramBlockStructureTypesController } from '#academic-offering/infrastructure/controller/program-block/get-all-program-block-structure-types.controller';
import { EditProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/edit-program-block.controller';
import { AddSubjectToProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/add-subject-to-program-block.controller';
import { DeleteProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/delete-program-block.controller';
import { GetSubjectsByProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/get-subjects-by-program-block/get-subjects-by-program-block.controller';
import { RemoveSubjectsFromProgramBlockController } from '#academic-offering/infrastructure/controller/program-block/remove-subjects-from-program-block.controller';
import { MoveSubjectController } from '#academic-offering/infrastructure/controller/program-block/move-subject-from-program-block.controller';

export const programBlockControllers = [
  GetAllProgramBlockStructureTypesController,
  CreateProgramBlockController,
  EditProgramBlockController,
  DeleteProgramBlockController,
  GetSubjectsByProgramBlockController,
  AddSubjectToProgramBlockController,
  RemoveSubjectsFromProgramBlockController,
  MoveSubjectController,
];
