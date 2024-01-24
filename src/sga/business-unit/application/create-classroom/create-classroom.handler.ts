import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateClassroomCommand } from '#business-unit/application/create-classroom/create-classroom.command';
import { ClassroomDuplicatedException } from '#shared/domain/exception/business-unit/classroom-duplicated.exception';
import { ClassroomDuplicatedCodeException } from '#shared/domain/exception/business-unit/classroom-duplicated-code.exception';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';

export class CreateClassroomHandler implements CommandHandler {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly examinationCenterGetter: ExaminationCenterGetter,
    private readonly adminUserGetter: AdminUserGetter,
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
    const adminUser = await this.adminUserGetter.get(command.userId);
    const classroom = Classroom.create(
      command.id,
      command.code,
      command.name,
      command.capacity,
      adminUser,
      examinationCenter,
    );

    await this.classroomRepository.save(classroom);
  }
}
