import { Title } from '#academic-offering/domain/entity/title.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class TitleRepository {
  abstract exists(id: string): Promise<boolean>;
  abstract save(title: Title): Promise<void>;
  abstract matching(
    criteria: any,
    adminUserBusinessUnits: any[],
    isSuperAdmin: boolean,
  ): Promise<Title[]>;
  abstract count(
    criteria: any,
    adminUserBusinessUnits: any[],
    isSuperAdmin: boolean,
  ): Promise<number>;
  abstract delete(title: Title): Promise<void>;
  abstract get(id: string): Promise<Title | null>;
  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Title | null>;
  abstract getByBusinessUnit(businessUnit: BusinessUnit): Promise<Title[]>;
}
