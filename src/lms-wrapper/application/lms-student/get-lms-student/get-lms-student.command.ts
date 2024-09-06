import { Command } from '#shared/domain/bus/command';

export class GetLmsStudentCommand implements Command {
  constructor(
    public readonly email: string,
    public readonly universaeEmail: string,
  ) {}
}
