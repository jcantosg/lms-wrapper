import { GetSubjectsNotEnrolledController } from '#student/infrastructure/controller/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.controller';
import { CreateEnrollmentController } from '#student/infrastructure/controller/enrollment/create-enrollment.controller';
import { GetEnrollmentsByAcademicRecordController } from '#student/infrastructure/controller/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.controller';

export const enrollmentControllers = [
  GetSubjectsNotEnrolledController,
  CreateEnrollmentController,
  GetEnrollmentsByAcademicRecordController,
];
