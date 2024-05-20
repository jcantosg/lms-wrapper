import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export abstract class AcademicRecordRepository {
  abstract save(academicRecord: AcademicRecord): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract getByAdminUser(
    academicRecordId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord | null>;

  abstract get(id: string): Promise<AcademicRecord | null>;

  abstract getStudentAcademicRecord(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord[] | null>;
}
