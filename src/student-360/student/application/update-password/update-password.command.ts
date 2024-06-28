import { Command } from '#shared/domain/bus/command';

export class UpdateStudentPasswordCommand implements Command {
  constructor(
    readonly newPassword: string,
    readonly token: string,
  ) {}
}
