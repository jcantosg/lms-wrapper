import { Command } from '#shared/domain/bus/command';

export class GetLmsCourseWithQuizzesQuery implements Command {
  constructor(
    public readonly courseId: number,
    public readonly studentId: number,
    public readonly isSpeciality: boolean,
  ) {}
}
