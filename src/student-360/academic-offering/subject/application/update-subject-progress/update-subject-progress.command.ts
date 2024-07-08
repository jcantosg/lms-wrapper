import { Command } from '#shared/domain/bus/command';
import { Student } from '#shared/domain/entity/student.entity';

export class UpdateSubjectProgressCommand implements Command {
  constructor(
    public readonly courseModuleId: number,
    public readonly student: Student,
    public readonly newStatus: number,
  ) {}
}
