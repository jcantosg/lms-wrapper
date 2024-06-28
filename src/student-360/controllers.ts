import { studentAcademicRecordControllers } from '#student-360/academic-offering/academic-record/infrastructure/controller/controllers';
import { studentSubjectControllers } from '#student-360/academic-offering/subject/infrastructure/controller/controllers';
import { studentAuthControllers } from '#student-360/student/infrastructure/controller/controllers';

export const studentControllers = [
  ...studentAuthControllers,
  ...studentAcademicRecordControllers,
  ...studentSubjectControllers,
];
