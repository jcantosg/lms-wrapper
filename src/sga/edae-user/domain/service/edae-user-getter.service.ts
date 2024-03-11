import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';

export class EdaeUserGetter {
  constructor(private readonly edaeUserRepository: EdaeUserRepository) {}

  async get(id: string): Promise<EdaeUser> {
    const edaeUser = await this.edaeUserRepository.get(id);

    if (!edaeUser) {
      throw new EdaeUserNotFoundException();
    }

    return edaeUser;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<EdaeUser> {
    const result = await this.edaeUserRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );
    if (!result) {
      throw new EdaeUserNotFoundException();
    }

    return result;
  }
}
