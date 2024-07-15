import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { ApplicationEvent } from '#shared/domain/event/application.event';

export class InternalGroupMemberAddedEvent implements ApplicationEvent {
  name: string = 'internal-group-member-added';

  constructor(readonly internalGroup: InternalGroup) {}
}
