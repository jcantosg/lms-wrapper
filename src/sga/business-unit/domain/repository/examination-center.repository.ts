import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';

export abstract class ExaminationCenterRepository {
  public abstract save(examinationCenter: ExaminationCenter): Promise<void>;
}
