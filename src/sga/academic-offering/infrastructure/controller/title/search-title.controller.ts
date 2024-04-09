import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TitleResponse } from '#academic-offering/infrastructure/controller/title/get-all-titles-list/get-title-list.response';
import { GetAllTitlesResponse } from '#academic-offering/infrastructure/controller/title/get-all-titles-list/get-all-title-list.response';
import { searchTitleSchema } from '#academic-offering/infrastructure/config/validation-schema/search-title.schema';
import { SearchTitleHandler } from '#academic-offering/applicaton/title/search-title/search-title.handler';
import { SearchTitleQuery } from '#academic-offering/applicaton/title/search-title/search-title.query';

type SearchTitleQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('title')
export class SearchTitleController {
  constructor(private readonly handler: SearchTitleHandler) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @UsePipes(new JoiRequestQueryParamValidationPipeService(searchTitleSchema))
  async searchSubjects(
    @Query() queryParams: SearchTitleQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<TitleResponse>> {
    const query = new SearchTitleQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
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
