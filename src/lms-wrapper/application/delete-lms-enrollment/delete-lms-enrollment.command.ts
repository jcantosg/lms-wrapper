import { Command } from '#shared/domain/bus/command';

export class DeleteLmsEnrollmentCommand implements Command {
  constructor(
    public readonly courseId: number,
    public readonly studentId: number,
  ) {}
}
