import { Command } from '#shared/domain/bus/command';

export class ExpireEdaeUserRefreshTokenCommand implements Command {
  constructor(public readonly edaeUserId: string) {}
}
