import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampusNotFoundException } from '#shared/domain/exception/business-unit/virtual-campus-not-found.exception';

export class VirtualCampusGetter {
  constructor(
    private readonly virtualCampusRepository: VirtualCampusRepository,
  ) {}

  async get(id: string): Promise<VirtualCampus> {
    const virtualCampus = await this.virtualCampusRepository.get(id);

    if (!virtualCampus) {
      throw new VirtualCampusNotFoundException();
    }

    return virtualCampus;
  }
}
