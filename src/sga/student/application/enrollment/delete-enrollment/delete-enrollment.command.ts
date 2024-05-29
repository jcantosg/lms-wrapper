import { Command } from '#shared/domain/bus/command';

export class DeleteEnrollmentCommand implements Command {
  constructor(public readonly enrollmentId: string) {}
}
