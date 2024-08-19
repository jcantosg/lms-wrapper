import { Communication } from '#shared/domain/entity/communication.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class CommunicationRepository {
  abstract save(communication: Communication): Promise<void>;

  abstract get(id: string): Promise<Communication | null>;

  abstract delete(id: string): Promise<void>;

  abstract exists(id: string): Promise<boolean>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<Communication[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;
}
