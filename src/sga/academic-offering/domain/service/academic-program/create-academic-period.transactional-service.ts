import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import {
  TransactionParams,
  TransactionalService,
} from '#shared/domain/service/transactional-service.service';

export interface CreateAcademicPeriodTransactionParams
  extends TransactionParams {
  academicPeriod: AcademicPeriod;
  periodBlocks: PeriodBlock[];
}

export abstract class CreateAcademicPeriodTransactionService extends TransactionalService {
  abstract execute(
    params: CreateAcademicPeriodTransactionParams,
  ): Promise<void>;
}
