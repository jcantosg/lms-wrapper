import { AcademicRecordCreatedListener } from '#student/infrastructure/listener/academic-record-created.listener';
import { InternalGroupMemberAddedListener } from '#student/infrastructure/listener/internal-group-member-added.listener';

export const listeners = [
  AcademicRecordCreatedListener,
  InternalGroupMemberAddedListener,
];
