import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';

export class TitleGetter {
  constructor(private readonly titleRepository: TitleRepository) {}

  async get(id: string): Promise<Title> {
    const title = await this.titleRepository.get(id);

    if (!title) {
      throw new TitleNotFoundException();
    }

    return title;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Title> {
    const result = await this.titleRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );

    if (!result) {
      throw new TitleNotFoundException();
    }

    return result;
  }
}
