import { QueryHandler } from '#shared/domain/bus/query.handler';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { GetAllEdaeUsersPlainQuery } from '#edae-user/application/get-all-edae-users-plain/get-all-edae-users-plain.query';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

export class GetAllEdaeUsersPlainHandler implements QueryHandler {
  constructor(
    private readonly edaeUserRepository: EdaeUserRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(query: GetAllEdaeUsersPlainQuery): Promise<EdaeUser[]> {
    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      query.businessUnitId,
      query.adminUserBusinessUnits,
    );

    return await this.edaeUserRepository.getByBusinessUnit(businessUnit);
  }
}
