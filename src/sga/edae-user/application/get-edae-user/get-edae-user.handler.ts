import { GetEdaeUserQuery } from '#edae-user/application/get-edae-user/get-edae-user.query';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class GetEdaeUserHandler implements QueryHandler {
  constructor(private readonly edaeUserGetter: EdaeUserGetter) {}

  async handle(query: GetEdaeUserQuery): Promise<EdaeUser> {
    return await this.edaeUserGetter.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
      query.isSuperAdmin,
    );
  }
}
