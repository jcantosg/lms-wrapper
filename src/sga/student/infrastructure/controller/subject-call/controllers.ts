import { GetSubjectCallFinalGradesController } from '#student/infrastructure/controller/subject-call/get-subject-call-final-grades.controller';
import { EditSubjectCallController } from '#student/infrastructure/controller/subject-call/edit-subject-call.controller';
import { AddSubjectCallController } from '#student/infrastructure/controller/subject-call/add-subject-call.controller';
import { RemoveSubjectCallController } from '#student/infrastructure/controller/subject-call/remove-subject-call.controller';
import { CreateSubjectCallsBatchController } from '#student/infrastructure/controller/subject-call/create-subject-calls-batch.controller';

export const subjectCallControllers = [
  GetSubjectCallFinalGradesController,
  EditSubjectCallController,
  AddSubjectCallController,
  RemoveSubjectCallController,
  CreateSubjectCallsBatchController,
];
