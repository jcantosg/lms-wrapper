import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { CreateAcademicPeriodCommand } from '#academic-offering/applicaton/create-academic-period/create-academic-period.command';
import { AcademicPeriodDuplicatedException } from '#shared/domain/exception/academic-offering/academic-period.duplicated.exception';
import { AcademicPeriodDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-period.duplicated-code.exception';
import { ExaminationCallDuplicatedException } from '#shared/domain/exception/academic-offering/examination-call.duplicated.exception';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodNotExaminationCallsException } from '#shared/domain/exception/academic-offering/academic-period.not-examination-calls.exception';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AcademicPeriodCreatedEvent } from '#academic-offering/domain/event/academic-period/academic-period-created.event';

export class CreateAcademicPeriodHandler implements CommandHandler {
  constructor(
    private readonly repository: AcademicPeriodRepository,
    private readonly examinationCallRepository: ExaminationCallRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: CreateAcademicPeriodCommand): Promise<void> {
    if (await this.repository.existsById(command.id)) {
      throw new AcademicPeriodDuplicatedException();
    }
    if (await this.repository.existsByCode(command.id, command.code)) {
      throw new AcademicPeriodDuplicatedCodeException();
    }
    if (command.examinationCalls.length === 0) {
      throw new AcademicPeriodNotExaminationCallsException();
    }

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnit,
      command.adminUsersBusinessUnits,
    );

    const academicPeriod = AcademicPeriod.create(
      command.id,
      command.name,
      command.code,
      command.startDate,
      command.endDate,
      businessUnit,
      command.blocksNumber,
      command.adminUser,
    );
    await this.repository.save(academicPeriod);
    await this.createExaminationCalls(academicPeriod, command);
    await this.eventDispatcher.dispatch(
      new AcademicPeriodCreatedEvent(
        academicPeriod.id,
        businessUnit.id,
        command.adminUser,
      ),
    );
  }

  private async createExaminationCalls(
    academicPeriod: AcademicPeriod,
    command: CreateAcademicPeriodCommand,
  ) {
    academicPeriod.examinationCalls = await Promise.all(
      command.examinationCalls.map(async (examinationCallValues) => {
        if (
          await this.examinationCallRepository.existsById(
            examinationCallValues.id,
          )
        ) {
          throw new ExaminationCallDuplicatedException();
        }

        const examinationCall = ExaminationCall.create(
          examinationCallValues.id,
          examinationCallValues.name,
          examinationCallValues.startDate,
          examinationCallValues.endDate,
          examinationCallValues.timezone,
          academicPeriod,
        );
        await this.examinationCallRepository.save(examinationCall);

        return examinationCall;
      }),
    );
  }
}
