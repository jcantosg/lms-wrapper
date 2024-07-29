import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { CreateAcademicRecordCommand } from '#student/application/academic-record/create-academic-record/create-academic-record.command';
import { VirtualCampusNotFoundException } from '#shared/domain/exception/business-unit/virtual-campus/virtual-campus-not-found.exception';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AcademicRecordDuplicatedException } from '#student/shared/exception/academic-record-duplicated.exception';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AcademicRecordCreatedEvent } from '#student/domain/event/academic-record/academic-record-created.event';
import { CreateAdministrativeProcessHandler } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.handler';
import { CreateAdministrativeProcessCommand } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.command';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

export class CreateAcademicRecordHandler implements CommandHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly virtualCampusGetter: VirtualCampusGetter,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly studentGetter: StudentGetter,
    private readonly eventDispatcher: EventDispatcher,
    private uuidService: UUIDGeneratorService,
    private readonly createAdministrativeProcessHandler: CreateAdministrativeProcessHandler,
  ) {}

  async handle(command: CreateAcademicRecordCommand) {
    if (await this.academicRecordRepository.existsById(command.id)) {
      throw new AcademicRecordDuplicatedException();
    }

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      command.adminUser.businessUnits.map((bu) => bu.id),
    );

    const virtualCampus = await this.virtualCampusGetter.get(
      command.virtualCampusId,
    );

    if (virtualCampus.businessUnit.id !== businessUnit.id) {
      throw new VirtualCampusNotFoundException();
    }

    const academicPeriod = await this.academicPeriodGetter.get(
      command.academicPeriodId,
    );

    if (
      academicPeriod.businessUnit.id !== businessUnit.id ||
      !academicPeriod.academicPrograms
        .map((program) => program.id)
        .includes(command.academicProgramId)
    ) {
      throw new AcademicPeriodNotFoundException();
    }

    const academicProgram = await this.academicProgramGetter.get(
      command.academicProgramId,
    );

    if (academicProgram.businessUnit.id !== businessUnit.id) {
      throw new AcademicProgramNotFoundException();
    }

    const student = await this.studentGetter.get(command.studentId);

    const sortedBlocks = academicPeriod.periodBlocks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );

    const administrativeGroup =
      await this.administrativeGroupRepository.getByAcademicPeriodAndProgramAndBlock(
        academicPeriod.id,
        academicProgram.id,
        sortedBlocks[1]?.name,
      );

    if (!administrativeGroup) {
      throw new AdministrativeGroupNotFoundException();
    }

    const academicRecord = AcademicRecord.create(
      command.id,
      businessUnit,
      virtualCampus,
      student,
      academicPeriod,
      academicProgram,
      command.academicRecordModality,
      command.isModular,
      command.adminUser,
    );

    await this.academicRecordRepository.save(academicRecord);

    await this.createAdministrativeProcessHandler.handle(
      new CreateAdministrativeProcessCommand(
        this.uuidService.generate(),
        academicRecord.id,
        student.id,
        command.adminUser,
      ),
    );

    await this.eventDispatcher.dispatch(
      new AcademicRecordCreatedEvent(administrativeGroup, student),
    );
  }
}
