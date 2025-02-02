import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export abstract class InternalGroupRepository {
  abstract save(internalGroup: InternalGroup): Promise<void>;

  abstract saveBatch(internalGroups: InternalGroup[]): Promise<void>;

  abstract get(internalGroupId: string): Promise<InternalGroup | null>;

  abstract getByKeys(
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    subject: Subject,
  ): Promise<InternalGroup[]>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<InternalGroup[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;

  abstract getByAdminUser(
    internalGroupId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<InternalGroup | null>;

  abstract getByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<InternalGroup | null>;

  abstract getAllByStudentAndKeys(
    studentId: string,
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
  ): Promise<InternalGroup[]>;

  abstract getAllByStudent(studentId: string): Promise<InternalGroup[]>;

  abstract getAllByTeacher(teacherId: string): Promise<InternalGroup[]>;

  abstract getByBusinessUnitsAndPeriodsAndPrograms(
    businessUnitIds: string[],
    academicPeriodIds: string[],
    academicProgramIds: string[],
  ): Promise<InternalGroup[]>;
}
