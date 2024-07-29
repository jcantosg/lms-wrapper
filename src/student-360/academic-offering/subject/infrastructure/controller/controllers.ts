import { GetSubjectController } from '#student-360/academic-offering/subject/infrastructure/controller/get-subject/get-subject.controller';
import { GetSubjectProgressController } from '#student-360/academic-offering/subject/infrastructure/controller/get-subject-progress/get-subject-progress.controller';
import { UpdateSubjectProgressController } from '#student-360/academic-offering/subject/infrastructure/controller/update-subject-progress.controller';

export const studentSubjectControllers = [
  GetSubjectProgressController,
  GetSubjectController,
  UpdateSubjectProgressController,
];
