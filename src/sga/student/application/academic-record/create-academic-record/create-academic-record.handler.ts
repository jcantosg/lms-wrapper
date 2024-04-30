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
import { StudentGetter } from '#student/domain/service/student-getter.service';
import { AcademicRecordDuplicatedException } from '#student/shared/exception/academic-record-duplicated.exception';

export class CreateAcademicRecordHandler implements CommandHandler {
  constructor(
    private academicRecordRepository: AcademicRecordRepository,
    private businessUnitGetter: BusinessUnitGetter,
    private virtualCampusGetter: VirtualCampusGetter,
    private academicPeriodGetter: AcademicPeriodGetter,
    private academicProgramGetter: AcademicProgramGetter,
    private studentGetter: StudentGetter,
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

    return this.academicRecordRepository.save(academicRecord);
  }
}
