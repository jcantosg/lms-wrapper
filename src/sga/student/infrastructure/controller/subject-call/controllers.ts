import { GetSubjectCallFinalGradesController } from '#student/infrastructure/controller/subject-call/get-subject-call-final-grades.controller';
import { EditSubjectCallController } from '#student/infrastructure/controller/subject-call/edit-subject-call.controller';
import { AddSubjectCallController } from '#student/infrastructure/controller/subject-call/add-subject-call.controller';

export const subjectCallControllers = [
  GetSubjectCallFinalGradesController,
  EditSubjectCallController,
  AddSubjectCallController,
];
