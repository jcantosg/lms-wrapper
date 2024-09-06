import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryPostgresRepository } from '#shared/infrastructure/repository/country.postgres-repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { RefreshTokenPostgresRepository } from '#admin-user/infrastructure/repository/refresh-token.postgres-repository';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentPostgresRepository } from '#shared/infrastructure/repository/student.postgres-repository';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { CRMImportPostgresRepository } from '#shared/infrastructure/repository/crm-import.postgres-repository';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { ChatroomPostgresRepository } from '#shared/infrastructure/repository/chatroom.postgres-repository';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { CommunicationPostgresRepository } from '#shared/infrastructure/repository/communication.postgres-repository';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationStudentPostgresRepository } from '#shared/infrastructure/repository/communication-student.postgres-repository';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { ChatFirebaseRepository } from '#shared/infrastructure/repository/chat.firebase-repository';

export const repositories = [
  {
    provide: CountryRepository,
    useClass: CountryPostgresRepository,
  },
  {
    provide: StudentRepository,
    useClass: StudentPostgresRepository,
  },
  {
    provide: RefreshTokenRepository,
    useClass: RefreshTokenPostgresRepository,
  },
  {
    provide: RecoveryPasswordTokenRepository,
    useClass: RecoveryPasswordTokenPostgresRepository,
  },
  {
    provide: CRMImportRepository,
    useClass: CRMImportPostgresRepository,
  },
  {
    provide: ChatroomRepository,
    useClass: ChatroomPostgresRepository,
  },
  {
    provide: CommunicationRepository,
    useClass: CommunicationPostgresRepository,
  },
  {
    provide: CommunicationStudentRepository,
    useClass: CommunicationStudentPostgresRepository,
  },
  {
    provide: ChatRepository,
    useClass: ChatFirebaseRepository,
  },
  {
    provide: CommunicationRepository,
    useClass: CommunicationPostgresRepository,
  },
  {
    provide: CommunicationStudentRepository,
    useClass: CommunicationStudentPostgresRepository,
  },
];
