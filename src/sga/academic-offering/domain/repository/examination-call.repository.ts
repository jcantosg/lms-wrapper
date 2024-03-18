import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';

export abstract class ExaminationCallRepository {
  abstract existsById(id: string): Promise<boolean>;

  abstract save(examinationCall: ExaminationCall): Promise<void>;

  abstract get(id: string): Promise<ExaminationCall | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ExaminationCall | null>;

  abstract delete(examinationCall: ExaminationCall): Promise<void>;
}
