import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';

export abstract class AcademicRecordTransferRepository {
  abstract save(academicRecordTransfer: AcademicRecordTransfer): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract get(id: string): Promise<AcademicRecordTransfer | null>;
}
