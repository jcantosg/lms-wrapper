import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { DeleteClassroomCommand } from '#business-unit/application/delete-classroom/delete-classroom.command';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';

export class DeleteClassroomHandler implements CommandHandler {
  constructor(
    private readonly repository: ClassroomRepository,
    private readonly classroomGetter: ClassroomGetter,
  ) {}

  async handle(command: DeleteClassroomCommand): Promise<void> {
    const classroom = await this.classroomGetter.get(command.classroomId);

    await this.repository.delete(classroom);
  }
}
