import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';

export interface TransferAcademicRecordTransactionParams
  extends TransactionParams {
  oldAcademicRecord: AcademicRecord;
  newAcademicRecord: AcademicRecord;
  academicRecordTransfer: AcademicRecordTransfer;
  enrollments: Enrollment[];
  internalGroups: InternalGroup[];
  oldEnrollments: Enrollment[];
}

export abstract class TransferAcademicRecordTransactionalService extends TransactionalService {
  abstract execute(
    params: TransferAcademicRecordTransactionParams,
  ): Promise<void>;
}
