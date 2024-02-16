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
import { GetAllAdminUsersHandler } from '#admin-user/application/get-all-admin-users/get-all-admin-users.handler';
import { GetAllAdminUsersQuery } from '#admin-user/application/get-all-admin-users/get-all-admin-users.query';
import { getAllAdminUsersSchema } from '#admin-user/infrastructure/config/validation-schema/get-all-admin-users.schema';
import { GetAllAdminUsersResponse } from '#admin-user/infrastructure/controller/get-all-admin-users/get-all-admin-users.response';
import { AdminUserResponse } from '#admin-user/infrastructure/controller/get-all-admin-users/get-admin-user.response';

type GetAllAdminUsersQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  surname?: string;
  email?: boolean;
  businessUnit?: string;
  role?: AdminUserRoles;
};

@Controller('admin-users')
export class GetAllAdminUsersController {
  constructor(private readonly handler: GetAllAdminUsersHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllAdminUsersSchema),
  )
  async getAllAdminUsers(
    @Query() queryParams: GetAllAdminUsersQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<AdminUserResponse>> {
    const query = new GetAllAdminUsersQuery(
      req.user.businessUnits,
      req.user.roles,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.surname,
      queryParams.businessUnit,
      queryParams.email,
      queryParams.role,
    );

    const response = await this.handler.handle(query);

    return GetAllAdminUsersResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
