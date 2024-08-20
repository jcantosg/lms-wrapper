import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';

export interface MoveStudentFromAdministrativeGroupTransactionParams
  extends TransactionParams {
  academicRecord: AcademicRecord;
  internalGroups: InternalGroup[];
  originAdminGroup: AdministrativeGroup;
  destinationAdminGroup: AdministrativeGroup;
}

export abstract class MoveStudentFromAdministrativeGroupTransactionalService extends TransactionalService {
  abstract execute(
    params: MoveStudentFromAdministrativeGroupTransactionParams,
  ): Promise<void>;
}
