import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetTitleDetailQuery } from '#academic-offering/applicaton/title/get-title-detail/get-title-detail.query';

export class GetTitleDetailHandler implements QueryHandler {
  constructor(private readonly titleGetter: TitleGetter) {}

  async handle(query: GetTitleDetailQuery) {
    return await this.titleGetter.getByAdminUser(
      query.id,
      query.user.businessUnits.map((bu) => bu.id),
      query.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
