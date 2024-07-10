import { Command } from '#shared/domain/bus/command';

export class CreateLmsEnrollmentCommand implements Command {
  constructor(
    public readonly courseId: number,
    public readonly studentId: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
