import { Student } from '#shared/domain/entity/student.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class StudentRepository {
  abstract save(student: Student): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract existsByEmail(id: string, email: string): Promise<boolean>;

  abstract existsByUniversaeEmail(
    id: string,
    universaeEmail: string,
  ): Promise<boolean>;

  abstract get(id: string): Promise<Student | null>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<Student[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;

  abstract getByEmail(email: string): Promise<Student | null>;

  abstract findByBuPeriodsAndPrograms(
    businessUnitIds: string[],
    academicPeriodIds: string[],
    academicProgramIds: string[],
  ): Promise<Student[]>;
}
