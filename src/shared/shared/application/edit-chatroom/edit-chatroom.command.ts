import { Command } from '#shared/domain/bus/command';

export class EditChatroomCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly chatroomId: string,
  ) {}
}
