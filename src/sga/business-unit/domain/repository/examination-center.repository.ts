import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export abstract class ExaminationCenterRepository {
  public abstract save(examinationCenter: ExaminationCenter): Promise<void>;

  public abstract existsById(id: string): Promise<boolean>;

  public abstract existsByName(name: string): Promise<boolean>;

  public abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract matching(criteria: Criteria): Promise<ExaminationCenter[]>;

  abstract count(criteria: Criteria): Promise<number>;

  public abstract get(id: string): Promise<ExaminationCenter | null>;

  public abstract delete(id: string): Promise<void>;

  public abstract update(examinationCenter: ExaminationCenter): Promise<void>;

  public abstract getNextAvailableCode(codePart: string): Promise<string>;

  public abstract getByBusinessUnit(
    businessUnitId: string,
  ): Promise<ExaminationCenter[]>;
}
