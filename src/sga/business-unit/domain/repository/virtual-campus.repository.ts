import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

export abstract class VirtualCampusRepository {
  abstract save(virtualCampus: VirtualCampus): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract get(id: string): Promise<VirtualCampus | null>;

  abstract update(virtualCampus: VirtualCampus): Promise<void>;

  abstract existsByName(id: string, name: string): Promise<boolean>;

  abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract getByBusinessUnit(businessUnit: string): Promise<VirtualCampus[]>;
}
