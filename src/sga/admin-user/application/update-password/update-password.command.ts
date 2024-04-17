import { Command } from '#shared/domain/bus/command';

export class UpdatePasswordCommand implements Command {
  constructor(
    readonly newPassword: string,
    readonly token: string,
  ) {}
}
