import { Title } from '#academic-offering/domain/entity/title.entity';

export abstract class TitleRepository {
  abstract exists(id: string): Promise<boolean>;
  abstract save(title: Title): Promise<void>;
}
