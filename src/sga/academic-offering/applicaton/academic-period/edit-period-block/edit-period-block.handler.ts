import { CommandHandler } from '#shared/domain/bus/command.handler';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { EditPeriodBlockCommand } from '#academic-offering/applicaton/academic-period/edit-period-block/edit-period-block.command';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { PeriodBlockGetter } from '#academic-offering/domain/service/period-block/period-block-getter.service';
import { PeriodBlockInvalidDateException } from '#shared/domain/exception/academic-offering/period-block.invalid-date.exception';
import { PeriodBlockInvalidException } from '#shared/domain/exception/academic-offering/period-block.invalid.exception';

export class EditPeriodBlockHandler implements CommandHandler {
  constructor(
    private readonly periodBlockGetter: PeriodBlockGetter,
    private readonly repository: PeriodBlockRepository,
  ) {}

  async handle(command: EditPeriodBlockCommand): Promise<void> {
    const periodBlock = await this.periodBlockGetter.getByAdminUser(
      command.id,
      command.adminUsersBusinessUnits,
      command.isSuperAdmin,
    );

    const periodBlockList = await this.repository.getByAcademicPeriod(
      periodBlock.academicPeriod.id,
    );

    if (periodBlockList.findIndex((pb) => pb.id === periodBlock.id) <= 0) {
      throw new PeriodBlockInvalidException();
    }

    this.verifyDate(command.startDate, periodBlock);

    periodBlock.startDate = command.startDate;

    const previousBlock =
      periodBlockList[
        periodBlockList.findIndex((pb) => pb.id === periodBlock.id) - 1
      ];

    if (previousBlock) {
      previousBlock.endDate = command.startDate;
    }

    await this.repository.save(periodBlock);
    await this.repository.save(previousBlock);
  }

  private verifyDate(newStartDate: Date, periodBlock: PeriodBlock) {
    if (newStartDate >= periodBlock.endDate) {
      throw new PeriodBlockInvalidDateException();
    }
  }
}
