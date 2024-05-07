import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlockInvalidDateException } from '#shared/domain/exception/academic-offering/period-block.invalid-date.exception';

export class StartDateValidator {
  constructor(private repository: PeriodBlockRepository) {}

  public async validateStartDate(
    academicPeriodId: string,
    startDate: Date,
  ): Promise<void> {
    const periodBlocks =
      await this.repository.getByAcademicPeriod(academicPeriodId);

    if (
      periodBlocks.find(
        (block) => block.startDate < startDate && block.endDate > startDate,
      )
    ) {
      throw new PeriodBlockInvalidDateException();
    }
  }
}
