import { GetAccessQualificationsController } from '#student/infrastructure/controller/get-access-qualifications.controller';
import { CreateStudentController } from '#student/infrastructure/controller/create-student.controller';
import { EditStudentController } from '#student/infrastructure/controller/edit-student.controller';
import { GetStudentsController } from '#student/infrastructure/controller/get-students/get-students.controller';
import { SearchStudentsController } from '#student/infrastructure/controller/search-students/search-students.controller';
import { academicRecordControllers } from '#student/infrastructure/controller/academic-record/controllers';
import { GetStudentController } from '#student/infrastructure/controller/get-student/get-student.controller';
import { enrollmentControllers } from '#student/infrastructure/controller/enrollment/controllers';
import { CreateInternalGroupsBatchController } from '#student/infrastructure/controller/create-internal-groups-batch.controller';
import { administrativeGroupControllers } from '#student/infrastructure/controller/administrative-group/controllers';

export const controllers = [
  GetAccessQualificationsController,
  CreateStudentController,
  EditStudentController,
  GetStudentsController,
  SearchStudentsController,
  GetStudentController,
  ...academicRecordControllers,
  ...enrollmentControllers,
  ...administrativeGroupControllers,
  CreateInternalGroupsBatchController,
];
