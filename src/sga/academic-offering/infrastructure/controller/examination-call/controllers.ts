import { CreateExaminationCallController } from '#academic-offering/infrastructure/controller/examination-call/create-examination-call.controller';
import { DeleteExaminationCallController } from '#academic-offering/infrastructure/controller/examination-call/delete-examination-call.controller';
import { EditExaminationCallController } from '#academic-offering/infrastructure/controller/examination-call/edit-examination-call.controller';

export const examinationCallControllers = [
  CreateExaminationCallController,
  DeleteExaminationCallController,
  EditExaminationCallController,
];
