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
import { AddInternalGroupToAcademicPeriodController } from '#student/infrastructure/controller/add-internal-group-to-academic-period.controller';
import { GetInternalGroupsController } from '#student/infrastructure/controller/internal-group/get-internal-groups/get-internal-groups.controller';
import { SearchInternalGroupsController } from '#student/infrastructure/controller/internal-group/search-internal-groups.controller';
import { subjectCallControllers } from '#student/infrastructure/controller/subject-call/controllers';
import { GetAllStudentsByAdministrativeGroupController } from '#student/infrastructure/controller/get-all-students-by-administrative-group/get-all-students-by-administrative-group.controller';
import { SearchStudentsByAdministrativeGroupController } from '#student/infrastructure/controller/search-students-by-administrative-group/search-students-by-administrative-group.controller';
import { GetInternalGroupDetailController } from '#student/infrastructure/controller/internal-group/get-internal-group-detail/get-internal-group-detail.controller';
import { AddTeacherToInternalGroupController } from '#student/infrastructure/controller/internal-group/add-teacher-to-internal-group.controller';
import { EditInternalGroupController } from '#student/infrastructure/controller/internal-group/edit-internal-group/edit-internal-group.controller';
import { GetCoursingSubjectStudentsController } from '#student/infrastructure/controller/get-coursing-subject-students/get-coursing-subject-students.controller';
import { AddStudentToInternalGroupController } from '#student/infrastructure/controller/internal-group/add-student-to-internal-group/add-student-to-internal-group.controller';
import { GetInternalGroupStudentsController } from '#student/infrastructure/controller/internal-group/get-internal-group-students/get-internal-group-students.controller';
import { RemoveTeacherFromInternalGroupController } from '#student/infrastructure/controller/internal-group/remove-teacher-from-internal-group.controller';
import { RemoveStudentFromInternalGroupController } from '#student/infrastructure/controller/internal-group/remove-student-from-internal-group.controller';
import { GetAllAdministrativeProcessStatusController } from '#student/infrastructure/controller/administrative-process/get-administrative-process-types.controller';
import { GetAllAdministrativeProcessTypesController } from '#student/infrastructure/controller/administrative-process/get-administrative-process-status.controller';
import { GetAllAdministrativeProcessesController } from '#student/infrastructure/controller/administrative-process/get-all-administrative-process/get-all-administrative-process.controller';
import { SearchAdministrativeProcessesController } from '#student/infrastructure/controller/administrative-process/search-administrative-processes.controller';

export const controllers = [
  GetAccessQualificationsController,
  CreateStudentController,
  EditStudentController,
  GetStudentsController,
  SearchStudentsController,
  GetCoursingSubjectStudentsController,
  GetStudentController,
  ...academicRecordControllers,
  CreateInternalGroupsBatchController,
  ...enrollmentControllers,
  ...administrativeGroupControllers,
  AddInternalGroupToAcademicPeriodController,
  GetInternalGroupsController,
  SearchInternalGroupsController,
  GetInternalGroupDetailController,
  ...subjectCallControllers,
  GetAllStudentsByAdministrativeGroupController,
  SearchStudentsByAdministrativeGroupController,
  AddTeacherToInternalGroupController,
  AddStudentToInternalGroupController,
  EditInternalGroupController,
  RemoveTeacherFromInternalGroupController,
  GetInternalGroupStudentsController,
  RemoveStudentFromInternalGroupController,
  GetAllAdministrativeProcessStatusController,
  GetAllAdministrativeProcessTypesController,
  GetAllAdministrativeProcessesController,
  SearchAdministrativeProcessesController,
];
