import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { DeleteClassroomCommand } from '#business-unit/application/classroom/delete-classroom/delete-classroom.command';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class DeleteClassroomHandler implements CommandHandler {
  constructor(
    private readonly repository: ClassroomRepository,
    private readonly classroomGetter: ClassroomGetter,
  ) {}

  async handle(command: DeleteClassroomCommand): Promise<void> {
    const classroom = await this.classroomGetter.get(command.classroomId);
    const businessUnits = classroom.examinationCenter.businessUnits;

    if (
      businessUnits.length > 0 &&
      !businessUnits.find((bu) =>
        command.adminUserBusinessUnits.includes(bu.id),
      )
    ) {
      throw new BusinessUnitNotFoundException();
    }
    classroom.examinationCenter.businessUnits;

    await this.repository.delete(classroom);
  }
}
