import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { CreateAdministrativeProcessCommand } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.command';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';

export class CreateAdministrativeProcessHandler implements CommandHandler {
  constructor(
    private readonly administrativeProcessRepository: AdministrativeProcessRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentGetter: StudentGetter,
  ) {}

  async handle(command: CreateAdministrativeProcessCommand) {
    const academicRecord = command.academicRecordId
      ? await this.academicRecordGetter.getByAdminUser(
          command.academicRecordId,
          command.adminUser,
        )
      : null;
    const student = command.studentId
      ? await this.studentGetter.get(command.studentId)
      : null;

    const administrativeProcess = AdministrativeProcess.create(
      command.id,
      AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
      student,
      academicRecord,
      academicRecord ? academicRecord.businessUnit : null,
    );

    await this.administrativeProcessRepository.save(administrativeProcess);
  }
}
