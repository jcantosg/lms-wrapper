import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetAllEdaeUsersHandler } from '#edae-user/application/get-all-edae-users/get-all-edae-users.handler';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetAllEdaeUsersQuery } from '#edae-user/application/get-all-edae-users/get-all-edae-users.query';
import { GetAllEdaeUsersResponse } from '#edae-user/infrastructure/controller/get-all-edae-users/get-all-edae-users.response';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getAllEdaeUsersSchema } from '#edae-user/infrastructure/config/validation-schema/get-all-edae-users.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

interface GetEdaeUsersQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  surname1?: string;
  surname2?: string;
  email?: string;
  role?: string;
  location?: string;
  businessUnit?: string;
}

@Controller('edae-user')
export class GetAllEdaeUsersController {
  constructor(private readonly handler: GetAllEdaeUsersHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllEdaeUsersSchema),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_360,
  )
  async getAllEdaeUsers(
    @Query() queryParams: GetEdaeUsersQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<GetAllEdaeUsersResponse>> {
    const query = new GetAllEdaeUsersQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      req.user.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
      queryParams.name,
      queryParams.surname1,
      queryParams.surname2,
      queryParams.email,
      queryParams.role,
      queryParams.location,
      queryParams.businessUnit,
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
