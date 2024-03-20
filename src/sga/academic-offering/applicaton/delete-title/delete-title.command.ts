import { Command } from '#shared/domain/bus/command';

export class DeleteTitleCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly adminUserBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
  ) {}
}
