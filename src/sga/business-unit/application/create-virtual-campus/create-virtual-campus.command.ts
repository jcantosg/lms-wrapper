import { Command } from '#shared/domain/bus/command';

export class CreateVirtualCampusCommand implements Command {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly businessUnitId: string,
    public readonly userId: string,
  ) {}
}
