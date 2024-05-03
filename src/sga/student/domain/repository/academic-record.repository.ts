import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export abstract class AcademicRecordRepository {
  abstract save(academicRecord: AcademicRecord): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract getByAdminUser(
    academicRecordId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord | null>;
}
