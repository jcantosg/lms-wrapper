import { AcademicRecordCreatedListener } from '#student/infrastructure/listener/academic-record-created.listener';
import { InternalGroupMemberAddedListener } from '#student/infrastructure/listener/internal-group-member-added.listener';
import { SubjectCallsCreatedListener } from '#student/infrastructure/listener/subject-calls-created.listener';
import { StudentUpdatePasswordListener } from '#student/infrastructure/listener/student-update-password.listener';

export const listeners = [
  AcademicRecordCreatedListener,
  InternalGroupMemberAddedListener,
  SubjectCallsCreatedListener,
  StudentUpdatePasswordListener,
];
