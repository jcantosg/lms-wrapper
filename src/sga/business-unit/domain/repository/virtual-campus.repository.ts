import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

export abstract class VirtualCampusRepository {
  abstract save(virtualCampus: VirtualCampus): Promise<void>;
  abstract existsById(id: string): Promise<boolean>;
  abstract get(id: string): Promise<VirtualCampus | null>;
  abstract update(virtualCampus: VirtualCampus): Promise<void>;
}
