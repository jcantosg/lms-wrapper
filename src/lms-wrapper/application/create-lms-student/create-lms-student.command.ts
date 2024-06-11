import { Command } from '#shared/domain/bus/command';

export class CreateLmsStudentCommand implements Command {
  constructor(
    public readonly username: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
