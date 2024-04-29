import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

export type VirtualCampusBasicInfoResponse = {
  id: string;
  name: string;
};

export class GetVirtualCampusByBusinessUnitResponse {
  static create(
    virtualCampus: VirtualCampus[],
  ): VirtualCampusBasicInfoResponse[] {
    return virtualCampus.map((vc) => {
      return {
        id: vc.id,
        name: vc.name,
      };
    });
  }
}
