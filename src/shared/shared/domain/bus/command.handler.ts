import { Command } from '#shared/domain/bus/command';

export interface CommandHandler {
  handle(command: Command): void;
}
