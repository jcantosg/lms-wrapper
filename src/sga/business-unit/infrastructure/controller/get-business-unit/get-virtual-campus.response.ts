import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

export interface VirtualCampusResponse {
  name: string;
  code: string;
}

export class GetVirtualCampusResponse {
  static create(virtualCampus: VirtualCampus): VirtualCampusResponse {
    return {
      name: virtualCampus.name,
      code: virtualCampus.code,
    };
  }
}
