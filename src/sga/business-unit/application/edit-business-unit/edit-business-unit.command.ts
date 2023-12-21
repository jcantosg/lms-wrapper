import { Command } from '#shared/domain/bus/command';

export class EditBusinessUnitCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly countryId: string,
    public readonly userId: string,
  ) {}
}
