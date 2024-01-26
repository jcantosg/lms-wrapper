import { Command } from '#shared/domain/bus/command';

export class DeleteExaminationCenterCommand implements Command {
  public constructor(
    public readonly id: string,
    readonly adminUserBusinessUnits: string[],
  ) {}
}
