import { Student } from '#shared/domain/entity/student.entity';
import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export interface CreateStudentFromCRMTransactionParams
  extends TransactionParams {
  student: Student;
  academicRecord: AcademicRecord | null;
  enrollments: Enrollment[];
  administrativeGroups: AdministrativeGroup[];
  internalGroups: InternalGroup[];
}

export abstract class CreateStudentFromCRMTransactionalService extends TransactionalService {
  abstract execute(
    params: CreateStudentFromCRMTransactionParams,
  ): Promise<void>;
}
