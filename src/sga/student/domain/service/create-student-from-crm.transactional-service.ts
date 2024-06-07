import { Student } from '#shared/domain/entity/student.entity';
import {
  TransactionParams,
  TransactionalService,
} from '#shared/domain/service/transactional-service.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';

export interface CreateStudentFromCRMTransactionParams
  extends TransactionParams {
  student: Student;
  academicRecord: AcademicRecord;
  enrollments: Enrollment[];
}

export abstract class CreateStudentFromCRMTransactionalService extends TransactionalService {
  abstract execute(
    params: CreateStudentFromCRMTransactionParams,
  ): Promise<void>;
}
