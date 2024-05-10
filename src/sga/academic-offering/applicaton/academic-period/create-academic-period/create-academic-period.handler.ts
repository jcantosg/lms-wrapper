import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { CreateAcademicPeriodCommand } from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.command';
import { AcademicPeriodDuplicatedException } from '#shared/domain/exception/academic-offering/academic-period.duplicated.exception';
import { AcademicPeriodDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-period.duplicated-code.exception';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AcademicPeriodCreatedEvent } from '#academic-offering/domain/event/academic-period/academic-period-created.event';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';

export class CreateAcademicPeriodHandler implements CommandHandler {
  constructor(
    private readonly repository: AcademicPeriodRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly eventDispatcher: EventDispatcher,
    private readonly transactionalService: TransactionalService,
  ) {}

  async handle(command: CreateAcademicPeriodCommand): Promise<void> {
    if (await this.repository.existsById(command.id)) {
      throw new AcademicPeriodDuplicatedException();
    }
    if (await this.repository.existsByCode(command.id, command.code)) {
      throw new AcademicPeriodDuplicatedCodeException();
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
      command.periodBlocks.length,
      command.adminUser,
    );
    const periodBlocks = [];
    for (const periodBlock of command.periodBlocks) {
      periodBlocks.push(
        PeriodBlock.create(
          periodBlock.id,
          academicPeriod,
          periodBlock.name,
          periodBlock.startDate,
          periodBlock.endDate,
          command.adminUser,
        ),
      );
    }
    academicPeriod.periodBlocks = periodBlocks;

    await this.transactionalService.execute({
      academicPeriod,
      periodBlocks,
    });

    await this.eventDispatcher.dispatch(
      new AcademicPeriodCreatedEvent(
        academicPeriod.id,
        businessUnit.id,
        command.adminUser,
      ),
    );
  }
}
