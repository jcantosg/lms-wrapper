import { Command } from '#shared/domain/bus/command';

export class GenerateRecoveryPasswordTokenCommand implements Command {
  constructor(public readonly email: string) {}
}
