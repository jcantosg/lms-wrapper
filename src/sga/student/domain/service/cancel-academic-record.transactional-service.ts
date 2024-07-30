import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export interface CancelAcademicRecordTransactionParams
  extends TransactionParams {
  academicRecord: AcademicRecord;
  enrollments: Enrollment[];
  internalGroups: InternalGroup[];
  administrativeGroup: AdministrativeGroup;
}

export abstract class CancelAcademicRecordTransactionalService extends TransactionalService {
  abstract execute(
    params: CancelAcademicRecordTransactionParams,
  ): Promise<void>;
}
