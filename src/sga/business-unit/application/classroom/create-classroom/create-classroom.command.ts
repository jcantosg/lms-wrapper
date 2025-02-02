import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';

export class CreateClassroomCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly capacity: number,
    public readonly examinationCenterId: string,
    public readonly user: AdminUser,
  ) {}
}
