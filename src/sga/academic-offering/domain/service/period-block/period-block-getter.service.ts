import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { PeriodBlockNotFoundException } from '#shared/domain/exception/academic-offering/period-block.not-found.exception';

export class PeriodBlockGetter {
  constructor(private repository: PeriodBlockRepository) {}

  public async get(id: string): Promise<PeriodBlock> {
    const periodBlock = await this.repository.get(id);
    if (!periodBlock) {
      throw new PeriodBlockNotFoundException();
    }

    return periodBlock;
  }

  public async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<PeriodBlock> {
    const periodBlock = await this.repository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );
    if (!periodBlock) {
      throw new PeriodBlockNotFoundException();
    }

    return periodBlock;
  }
}
