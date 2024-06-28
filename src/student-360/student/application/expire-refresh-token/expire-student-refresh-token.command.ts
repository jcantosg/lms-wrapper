import { Command } from '#shared/domain/bus/command';

export class ExpireStudentRefreshTokenCommand implements Command {
  constructor(public readonly studentId: string) {}
}
