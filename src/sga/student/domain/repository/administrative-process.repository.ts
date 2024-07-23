import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';

export abstract class AdministrativeProcessRepository {
  abstract save(administrativeProcess: AdministrativeProcess): Promise<void>;
  abstract get(id: string): Promise<AdministrativeProcess | null>;
}
