import { Command } from '#shared/domain/bus/command';

export class DeleteChatUserCommand implements Command {
  constructor(public readonly studentId: string) {}
}
