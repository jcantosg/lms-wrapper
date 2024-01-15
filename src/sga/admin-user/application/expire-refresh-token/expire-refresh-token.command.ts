import { Command } from '#shared/domain/bus/command';

export class ExpireRefreshTokenCommand implements Command {
  constructor(readonly adminUserId: string) {}
}
