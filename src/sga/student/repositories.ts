import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordPostgresRepository } from '#student/infrastructure/repository/academic-record.postgres-repository';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupPostgresRepository } from '#student/infrastructure/repository/administrative-group.postgres-repository';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupPostgresRepository } from '#student/infrastructure/repository/internal-group.postgres-repository';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentPostgresRepository } from '#student/infrastructure/repository/enrollment.postgres-repository';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallPostgresRepository } from '#student/infrastructure/repository/subject-call.postgres-repository';
import { AcademicRecordTransferRepository } from '#student/domain/repository/academic-record-transfer.repository';
import { AcademicRecordTransferPostgresRepository } from '#student/infrastructure/repository/academic-record-transfer.postgres-repository';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcessPostgresRepository } from '#student/infrastructure/repository/administrative-process.postgres-repository';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { ChatFirebaseRepository } from '#shared/infrastructure/repository/chat.firebase-repository';
import { SubjectCallScheduleHistoryRepository } from '#student/domain/repository/subject-call-schedule-history.repository';
import { SubjectCallScheduleHistoryPostgresRepository } from '#student/infrastructure/repository/subject-call-shcedule-history.postgres-repository';

export const repositories = [
  {
    provide: AcademicRecordRepository,
    useClass: AcademicRecordPostgresRepository,
  },
  {
    provide: AdministrativeGroupRepository,
    useClass: AdministrativeGroupPostgresRepository,
  },
  {
    provide: InternalGroupRepository,
    useClass: InternalGroupPostgresRepository,
  },
  {
    provide: EnrollmentRepository,
    useClass: EnrollmentPostgresRepository,
  },
  {
    provide: SubjectCallRepository,
    useClass: SubjectCallPostgresRepository,
  },
  {
    provide: AcademicRecordTransferRepository,
    useClass: AcademicRecordTransferPostgresRepository,
  },
  {
    provide: AdministrativeProcessRepository,
    useClass: AdministrativeProcessPostgresRepository,
  },
  {
    provide: ChatRepository,
    useClass: ChatFirebaseRepository,
  },
  {
    provide: SubjectCallScheduleHistoryRepository,
    useClass: SubjectCallScheduleHistoryPostgresRepository,
  },
];
