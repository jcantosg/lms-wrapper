import { Command } from '#shared/domain/bus/command';
import { Student } from '#shared/domain/entity/student.entity';

export class DeleteCommunicationCommand implements Command {
  constructor(
    public readonly communicationIds: string[],
    public readonly student: Student,
  ) {}
}
