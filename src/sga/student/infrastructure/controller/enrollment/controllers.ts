import { GetSubjectsNotEnrolledController } from '#student/infrastructure/controller/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.controller';
import { CreateEnrollmentController } from '#student/infrastructure/controller/enrollment/create-enrollment.controller';

export const enrollmentControllers = [
  GetSubjectsNotEnrolledController,
  CreateEnrollmentController,
];
