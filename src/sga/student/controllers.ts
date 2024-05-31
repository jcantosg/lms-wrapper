import { GetAccessQualificationsController } from '#student/infrastructure/controller/get-access-qualifications.controller';
import { CreateStudentController } from '#student/infrastructure/controller/create-student.controller';
import { EditStudentController } from '#student/infrastructure/controller/edit-student.controller';
import { GetStudentsController } from '#student/infrastructure/controller/get-students/get-students.controller';
import { SearchStudentsController } from '#student/infrastructure/controller/search-students/search-students.controller';
import { academicRecordControllers } from '#student/infrastructure/controller/academic-record/controllers';
import { GetStudentController } from '#student/infrastructure/controller/get-student/get-student.controller';
import { CreateInternalGroupsBatchController } from '#student/infrastructure/controller/create-internal-groups-batch.controller';
import { enrollmentControllers } from '#student/infrastructure/controller/enrollment/controllers';
import { administrativeGroupControllers } from '#student/infrastructure/controller/administrative-group/controllers';
import { GetInternalGroupsController } from '#student/infrastructure/controller/internal-group/get-internal-groups/get-internal-groups.controller';
import { SearchInternalGroupsController } from '#student/infrastructure/controller/internal-group/search-internal-groups.controller';

export const controllers = [
  GetAccessQualificationsController,
  CreateStudentController,
  EditStudentController,
  GetStudentsController,
  SearchStudentsController,
  GetStudentController,
  ...academicRecordControllers,
  CreateInternalGroupsBatchController,
  ...enrollmentControllers,
  ...administrativeGroupControllers,
  GetInternalGroupsController,
  SearchInternalGroupsController,
];
