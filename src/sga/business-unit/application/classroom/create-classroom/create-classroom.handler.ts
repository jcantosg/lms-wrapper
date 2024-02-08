import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { CreateClassroomCommand } from '#business-unit/application/classroom/create-classroom/create-classroom.command';
import { ClassroomDuplicatedException } from '#shared/domain/exception/business-unit/classroom-duplicated.exception';
import { ClassroomDuplicatedCodeException } from '#shared/domain/exception/business-unit/classroom-duplicated-code.exception';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';

export class CreateClassroomHandler implements CommandHandler {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
  ) {}

  async handle(command: CreateClassroomCommand): Promise<void> {
    if (await this.classroomRepository.existsById(command.id)) {
      throw new ClassroomDuplicatedException();
    }
    if (
      await this.classroomRepository.existsByNameAndExaminationCenter(
        command.id,
        command.name,
        command.examinationCenterId,
      )
    ) {
      throw new ClassroomDuplicatedException();
    }
    if (await this.classroomRepository.existsByCode(command.id, command.code)) {
      throw new ClassroomDuplicatedCodeException();
    }
    const examinationCenter = await this.examinationCenterGetter.get(
      command.examinationCenterId,
    );
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    if (
      examinationCenter.businessUnits.length > 0 &&
      !examinationCenter.businessUnits.find((bu) =>
        adminUserBusinessUnits.includes(bu.id),
      )
    ) {
      throw new BusinessUnitNotFoundException();
    }

    const classroom = Classroom.create(
      command.id,
      command.code,
      command.name,
      command.capacity,
      command.user,
      examinationCenter,
    );

    await this.classroomRepository.save(classroom);
  }
}
