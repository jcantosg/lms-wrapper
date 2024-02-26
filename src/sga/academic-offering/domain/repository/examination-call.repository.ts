import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';

export abstract class ExaminationCallRepository {
  abstract existsById(id: string): Promise<boolean>;

  abstract save(examinationCall: ExaminationCall): Promise<void>;
}
