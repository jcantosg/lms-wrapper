import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { EditAcademicPeriodCommand } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.command';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicPeriodDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-period.duplicated-code.exception';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodInvalidDateException } from '#shared/domain/exception/academic-offering/academic-period.invalid-date.exception';

export class EditAcademicPeriodHandler implements CommandHandler {
  constructor(
    private readonly getter: AcademicPeriodGetter,
    private readonly repository: AcademicPeriodRepository,
    private readonly periodBlockRepository: PeriodBlockRepository,
  ) {}

  async handle(command: EditAcademicPeriodCommand): Promise<void> {
    const academicPeriod = await this.getter.getByAdminUser(
      command.id,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (await this.repository.existsByCode(command.id, command.code)) {
      throw new AcademicPeriodDuplicatedCodeException();
    }

    const periodBlocks = await this.periodBlockRepository.getByAcademicPeriod(
      academicPeriod.id,
    );

    if (periodBlocks.length > 0) {
      this.checkPeriodBlocksDate(
        command.startDate,
        command.endDate,
        periodBlocks,
      );
    }

    academicPeriod.update(
      command.name,
      command.code,
      command.startDate,
      command.endDate,
      command.adminUser,
    );

    await this.repository.update(academicPeriod);

    if (periodBlocks.length > 0) {
      await this.updatePeriodBlocks(academicPeriod, periodBlocks);
    }
  }

  private checkPeriodBlocksDate(
    startDate: Date,
    endDate: Date,
    periodBlocks: PeriodBlock[],
  ) {
    const sortedBlocks = periodBlocks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
    const firstBlock = sortedBlocks[0];
    const lastBlock = sortedBlocks[periodBlocks.length - 1];

    if (startDate >= firstBlock.endDate || endDate <= lastBlock.startDate) {
      throw new AcademicPeriodInvalidDateException();
    }
  }

  private async updatePeriodBlocks(
    academicPeriod: AcademicPeriod,
    periodBlocks: PeriodBlock[],
  ) {
    const sortedBlocks = periodBlocks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
    const firstBlock = sortedBlocks[0];
    const lastBlock = sortedBlocks[periodBlocks.length - 1];

    firstBlock.startDate = academicPeriod.startDate;
    lastBlock.endDate = academicPeriod.endDate;

    await this.periodBlockRepository.save(firstBlock);
    if (firstBlock.id !== lastBlock.id) {
      await this.periodBlockRepository.save(lastBlock);
    }
  }
}
