import { CreateExaminationCallCommand } from './create-examination-call.command';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { ExaminationCallDuplicatedException } from '#shared/domain/exception/academic-offering/examination-call.duplicated.exception';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';

export class CreateExaminationCallHandler implements CommandHandler {
  constructor(
    private examinationCallRepository: ExaminationCallRepository,
    private academicPeriodGetter: AcademicPeriodGetter,
  ) {}

  async handle(command: CreateExaminationCallCommand): Promise<void> {
    const existingExaminationCall =
      await this.examinationCallRepository.existsById(command.id);
    if (existingExaminationCall) {
      throw new ExaminationCallDuplicatedException();
    }

    const academicPeriod = await this.academicPeriodGetter.get(
      command.academicPeriodId,
    );

    const academicPeriodBusinessUnitId = academicPeriod.businessUnit.id;
    if (
      !command.adminUserBusinessUnits.includes(academicPeriodBusinessUnitId)
    ) {
      throw new AcademicPeriodNotFoundException();
    }

    const examinationCall = ExaminationCall.create(
      command.id,
      command.name,
      command.startDate,
      command.endDate,
      command.timezone,
      academicPeriod,
    );
    await this.examinationCallRepository.save(examinationCall);
  }
}
