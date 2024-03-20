import { Title } from '#academic-offering/domain/entity/title.entity';

export abstract class TitleRepository {
  abstract exists(id: string): Promise<boolean>;
  abstract save(title: Title): Promise<void>;
  abstract delete(title: Title): Promise<void>;
  abstract get(id: string): Promise<Title | null>;
  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Title | null>;
}
