import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetTitleDetailQuery } from '#academic-offering/applicaton/get-title-detail/get-title-detail.query';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';

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
