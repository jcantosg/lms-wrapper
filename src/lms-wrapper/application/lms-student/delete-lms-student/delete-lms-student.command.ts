import { Command } from '#shared/domain/bus/command';

export class DeleteLmsStudentCommand implements Command {
  constructor(public readonly id: number) {}
}
