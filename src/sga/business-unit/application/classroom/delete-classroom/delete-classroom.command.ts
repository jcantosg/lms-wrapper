import { Command } from '#shared/domain/bus/command';

export class DeleteClassroomCommand implements Command {
  constructor(
    public readonly classroomId: string,
    readonly adminUserBusinessUnits: string[],
  ) {}
}
