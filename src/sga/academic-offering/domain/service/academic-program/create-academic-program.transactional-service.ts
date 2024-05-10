import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import {
  TransactionParams,
  TransactionalService,
} from '#shared/domain/service/transactional-service.service';

export interface CreateAcademicProgramTransactionParams
  extends TransactionParams {
  academicProgram: AcademicProgram;
  programBlocks: ProgramBlock[];
}

export abstract class CreateAcademicProgramTransactionService extends TransactionalService {
  abstract execute(
    params: CreateAcademicProgramTransactionParams,
  ): Promise<void>;
}
