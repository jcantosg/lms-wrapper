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
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TitleResponse } from '#academic-offering/infrastructure/controller/title/get-all-titles-list/get-title-list.response';
import { GetAllTitlesResponse } from '#academic-offering/infrastructure/controller/title/get-all-titles-list/get-all-title-list.response';
import { getAllTitlesSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-title-list.schema';
import { GetTitleListHandler } from '#academic-offering/applicaton/title/get-all-titles/get-title-list.handler';
import { GetAllTitlesListQuery } from '#academic-offering/applicaton/title/get-all-titles/get-title-list.query';

type GetTitleListQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  officialCode?: string;
  officialProgram?: string;
  officialTitle?: string;
  businessUnit?: string;
};

@Controller('title')
export class GetAllTitlesController {
  constructor(private readonly handler: GetTitleListHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestQueryParamValidationPipeService(getAllTitlesSchema))
  async getAllTitles(
    @Req() req: AuthRequest,
    @Query() queryParams: GetTitleListQueryParams,
  ): Promise<CollectionResponse<TitleResponse>> {
    const query = new GetAllTitlesListQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
      req.user.businessUnits,
      queryParams.name,
      queryParams.officialCode,
      queryParams.officialTitle,
      queryParams.officialProgram,
      queryParams.businessUnit,
    );

    const response = await this.handler.handle(query);

    return GetAllTitlesResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
