import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SearchAcademicProgramsHandler } from '#academic-offering/applicaton/academic-program/search-academic-programs/search-academic-programs.handler';

import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { SearchAcademicProgramsQuery } from '#academic-offering/applicaton/academic-program/search-academic-programs/search-academic-programs.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllAcademicProgramsResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-programs/get-all-academic-programs.response';
import { searchAcademicProgramsSchema } from '#academic-offering/infrastructure/config/validation-schema/search-academic-programs.schema';

interface SearchAcademyQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('academic-program')
export class SearchAcademicProgramsController {
  constructor(private handler: SearchAcademicProgramsHandler) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchAcademicProgramsSchema),
  )
  async searchAcademicPrograms(
    @Query() queryParams: SearchAcademyQueryParams,
    @Request() req: AuthRequest,
  ): Promise<CollectionResponse<GetAllAcademicProgramsResponse>> {
    const query = new SearchAcademicProgramsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const response = await this.handler.handle(query);

    return GetAllAcademicProgramsResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
