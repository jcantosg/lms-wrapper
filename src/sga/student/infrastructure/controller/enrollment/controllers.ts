import { GetSubjectsNotEnrolledController } from '#student/infrastructure/controller/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.controller';
import { CreateEnrollmentController } from '#student/infrastructure/controller/enrollment/create-enrollment.controller';
import { GetEnrollmentsByAcademicRecordController } from '#student/infrastructure/controller/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.controller';
import { GetEnrollmentVisibilityController } from '#student/infrastructure/controller/enrollment/get-enrollment-visibility.controller';
import { GetEnrollmentTypeController } from '#student/infrastructure/controller/enrollment/get-enrollment-type.controller';
import { EditEnrollmentController } from '#student/infrastructure/controller/enrollment/edit-enrollment.controller';
import { DeleteEnrollmentController } from '#student/infrastructure/controller/enrollment/delete-enrollment.controller';

export const enrollmentControllers = [
  GetSubjectsNotEnrolledController,
  CreateEnrollmentController,
  GetEnrollmentsByAcademicRecordController,
  GetEnrollmentVisibilityController,
  GetEnrollmentTypeController,
  EditEnrollmentController,
  DeleteEnrollmentController,
];
