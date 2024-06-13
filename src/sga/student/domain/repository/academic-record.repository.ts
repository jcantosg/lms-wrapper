import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Student } from '#shared/domain/entity/student.entity';

export abstract class AcademicRecordRepository {
  abstract save(academicRecord: AcademicRecord): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract getByAdminUser(
    academicRecordId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord | null>;

  abstract get(id: string): Promise<AcademicRecord | null>;

  abstract getStudentAcademicRecords(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord[]>;

  abstract getStudentAcademicRecordByPeriodAndProgram(
    studentId: string,
    academicPeriodId: string,
    academicProgramId: string,
  ): Promise<AcademicRecord | null>;

  abstract matching(criteria: Criteria): Promise<AcademicRecord[]>;

  abstract getByStudent(
    id: string,
    student: Student,
  ): Promise<AcademicRecord | null>;
}
