import { Student } from '#shared/domain/entity/student.entity';
import {
  TransactionParams,
  TransactionalService,
} from '#shared/domain/service/transactional-service.service';

export interface CreateStudentFromSGATransactionParams
  extends TransactionParams {
  student: Student;
}

export abstract class CreateStudentFromSGATransactionService extends TransactionalService {
  abstract execute(
    params: CreateStudentFromSGATransactionParams,
  ): Promise<void>;
}
