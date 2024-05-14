import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';

export abstract class InternalGroupRepository {
  abstract save(internalGroup: InternalGroup): Promise<void>;
  abstract saveBatch(internalGroups: InternalGroup[]): Promise<void>;
  abstract get(internalGroupId: string): Promise<InternalGroup | null>;
  abstract getByKeys(
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    subject: Subject,
  ): Promise<InternalGroup[]>;
}