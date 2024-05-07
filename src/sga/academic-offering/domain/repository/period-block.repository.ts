import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';

export abstract class PeriodBlockRepository {
  abstract existsById(id: string): Promise<boolean>;
  abstract save(periodBlock: PeriodBlock): Promise<void>;
  abstract get(id: string): Promise<PeriodBlock | null>;
  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<PeriodBlock | null>;
  abstract delete(periodBlock: PeriodBlock): Promise<void>;
  abstract getByAcademicPeriod(
    academicPeriodId: string,
  ): Promise<PeriodBlock[]>;
}
