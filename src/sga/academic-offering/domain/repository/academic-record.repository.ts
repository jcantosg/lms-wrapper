import { AcademicRecord } from '#academic-offering/domain/entity/academic-record.entity';

export abstract class AcademicRecordRepository {
  abstract save(academicRecord: AcademicRecord): Promise<void>;
}
