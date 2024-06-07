import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export abstract class EnrollmentRepository {
  abstract save(enrollment: Enrollment): Promise<void>;

  abstract get(id: string): Promise<Enrollment | null>;

  abstract matching(criteria: Criteria): Promise<Enrollment[]>;

  abstract delete(enrollment: Enrollment): Promise<void>;

  abstract getByAcademicRecord(
    academicRecord: AcademicRecord,
  ): Promise<Enrollment[]>;

  abstract getByAdminUser(
    enrollmentId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Enrollment | null>;
}
