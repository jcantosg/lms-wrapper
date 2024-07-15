import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatroomsByInternalGroupCreator } from '#shared/domain/service/chatrooms-by-internal-group-creator.service';
import { InternalGroupMemberAddedEvent } from '#student/domain/event/internal-group/internal-group-member-added.event';

@Injectable()
export class InternalGroupMemberAddedListener {
  constructor(
    private readonly chatroomCreator: ChatroomsByInternalGroupCreator,
  ) {}

  @OnEvent('internal-group-member-added')
  async handleInternalGroupMemberAddedEvent(
    payload: InternalGroupMemberAddedEvent,
  ) {
    await this.chatroomCreator.create(payload.internalGroup.id);
  }
}
