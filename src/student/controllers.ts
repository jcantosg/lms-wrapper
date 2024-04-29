import { GetAccessQualificationsController } from '#/student/infrastructure/controller/get-access-qualifications.controller';
import { CreateStudentController } from '#/student/infrastructure/controller/create-student.controller';
import { EditStudentController } from '#/student/infrastructure/controller/edit-student.controller';
import { academicRecordControllers } from '#/student/infrastructure/controller/academic-record/controllers';

export const controllers = [
  GetAccessQualificationsController,
  CreateStudentController,
  EditStudentController,
  ...academicRecordControllers,
];
