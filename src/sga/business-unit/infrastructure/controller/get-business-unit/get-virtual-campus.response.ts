import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

export interface VirtualCampusResponse {
  id: string;
  name: string;
  code: string;
  isMain: boolean;
  isActive: boolean;
}

export class GetVirtualCampusResponse {
  static create(virtualCampus: VirtualCampus): VirtualCampusResponse {
    return {
      id: virtualCampus.id,
      name: virtualCampus.name,
      code: virtualCampus.code,
      isMain: virtualCampus.isMain,
      isActive: virtualCampus.isActive,
    };
  }
}
