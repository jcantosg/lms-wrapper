import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

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

  abstract getBySubject(
    subject: Subject,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Enrollment[]>;

  abstract getByMultipleSubjects(
    subjects: Subject[],
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Enrollment[]>;

  abstract getByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<Enrollment | null>;

  abstract getByStudentsAndSubjects(
    studentIds: string[],
    subjectIds: string[],
  ): Promise<Enrollment[]>;
}
