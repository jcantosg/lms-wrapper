import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EditClassroomCommand } from '#business-unit/application/edit-classroom/edit-classroom.command';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { ClassroomDuplicatedException } from '#shared/domain/exception/business-unit/classroom-duplicated.exception';
import { ClassroomDuplicatedCodeException } from '#shared/domain/exception/business-unit/classroom-duplicated-code.exception';

export class EditClassroomHandler implements CommandHandler {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly classroomGetter: ClassroomGetter,
    private readonly adminUserGetter: AdminUserGetter,
  ) {}

  async handle(command: EditClassroomCommand): Promise<void> {
    const classroom = await this.classroomGetter.get(command.id);

    if (
      await this.classroomRepository.existsByNameAndExaminationCenter(
        command.id,
        command.name,
        classroom.examinationCenter.id,
      )
    ) {
      throw new ClassroomDuplicatedException();
    }

    if (await this.classroomRepository.existsByCode(command.id, command.code)) {
      throw new ClassroomDuplicatedCodeException();
    }

    const user = await this.adminUserGetter.get(command.userId);

    classroom.update(command.name, command.code, command.capacity, user);

    this.classroomRepository.update(classroom);
  }
}
