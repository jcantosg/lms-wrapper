import { Command } from '#shared/domain/bus/command';

export class UpdateCourseModuleProgressCommand implements Command {
  constructor(
    public readonly courseModuleId: number,
    public readonly studentId: number,
    public readonly newStatus: number,
  ) {}
}
