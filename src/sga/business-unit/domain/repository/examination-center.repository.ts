import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export abstract class ExaminationCenterRepository {
  public abstract save(examinationCenter: ExaminationCenter): Promise<void>;

  public abstract existsById(id: string): Promise<boolean>;

  public abstract existsByName(name: string): Promise<boolean>;

  public abstract existsByCode(code: string): Promise<boolean>;

  public abstract get(id: string): Promise<ExaminationCenter | null>;
}
