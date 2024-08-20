import { Command } from '#shared/domain/bus/command';

export class CreateChatUserCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly displayName: string,
  ) {}
}
