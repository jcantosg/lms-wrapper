import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';

export abstract class AdministrativeGroupRepository {
  abstract save(administrativeGroup: AdministrativeGroup): Promise<void>;
  abstract saveBatch(
    administrativeGroups: AdministrativeGroup[],
  ): Promise<void>;
  abstract existsById(id: string): Promise<boolean>;
  abstract existsByCode(id: string, code: string): Promise<boolean>;
}
