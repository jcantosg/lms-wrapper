import { Command } from '#shared/domain/bus/command';

export class CreateEdaeUserRefreshTokenCommand implements Command {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly ttl: number,
  ) {}
}
