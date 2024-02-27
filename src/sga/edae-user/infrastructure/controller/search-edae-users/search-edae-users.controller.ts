import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SearchEdaeUsersHandler } from '#edae-user/application/search-edae-users/search-edae-users.handler';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { GetAllEdaeUsersResponse } from '#edae-user/infrastructure/controller/get-all-edae-users/get-all-edae-users.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { SearchEdaeUsersQuery } from '#edae-user/application/search-edae-users/search-edae-users.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { searchEdaeUsersSchema } from '#edae-user/infrastructure/config/validation-schema/search-edae-users.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

interface SearchEdaeUsersQueryParams {
  text: string;
  page: number;
  limit: number;
  orderBy: string | undefined;
  orderType: OrderTypes | undefined;
}

@Controller('edae-user')
export class SearchEdaeUsersController {
  constructor(private readonly handler: SearchEdaeUsersHandler) {}

  @Get('search')
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchEdaeUsersSchema),
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SUPERVISOR_360,
  )
  async searchEdaeUsers(
    @Query() queryParams: SearchEdaeUsersQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<GetAllEdaeUsersResponse>> {
    const query = new SearchEdaeUsersQuery(
      queryParams.text,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.page,
      queryParams.limit,
      req.user.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const response = await this.handler.handle(query);

    return GetAllEdaeUsersResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
