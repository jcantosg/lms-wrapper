import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export abstract class AcademicPeriodRepository {
  abstract existsById(id: string): Promise<boolean>;

  abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract save(academicPeriod: AcademicPeriod): Promise<void>;
}
