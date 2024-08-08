import { Communication } from '#shared/domain/entity/communication.entity';

export abstract class CommunicationRepository {
  abstract save(communication: Communication): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}
