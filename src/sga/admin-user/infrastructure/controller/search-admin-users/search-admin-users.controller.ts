import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { SearchAdminUsersHandler } from '#admin-user/application/search-admin-users/search-admin-users.handler';
import { searchAdminUsersSchema } from '#admin-user/infrastructure/config/validation-schema/search-admin-users.schema';
import { AdminUserResponse } from '#admin-user/infrastructure/controller/search-admin-users/search-admin-user.response';
import { SearchAdminUsersQuery } from '#admin-user/application/search-admin-users/search-admin-users.query';
import { SearchAdminUsersResponse } from '#admin-user/infrastructure/controller/search-admin-users/search-admin-users.response';

type SearchAdminUsersQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('admin-users')
export class SearchAdminUsersController {
  constructor(private readonly handler: SearchAdminUsersHandler) {}

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchAdminUsersSchema),
  )
  async getAllAdminUsers(
    @Query() queryParams: SearchAdminUsersQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<AdminUserResponse>> {
    const query = new SearchAdminUsersQuery(
      req.user.businessUnits,
      req.user.roles,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
    );

    const response = await this.handler.handle(query);

    return SearchAdminUsersResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
