import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { SearchAcademicProgramsByTitleHandler } from '#academic-offering/applicaton/academic-program/search-academic-programs-by-title/search-academic-programs-by-title.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import {
  searchAcademicProgramByTitleIdSchema,
  searchAcademicProgramByTitleSchema,
} from '#academic-offering/infrastructure/config/validation-schema/search-academic-programs-by-titl.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { GetAcademicProgramsByTitleResponse } from '#academic-offering/infrastructure/controller/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.response';
import { SearchAcademicProgramsByTitleQuery } from '#academic-offering/applicaton/academic-program/search-academic-programs-by-title/search-academic-programs-by-title.query';

interface SearchAcademicProgramasByTitleQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('title')
export class SearchAcademicProgramsByTitleController {
  constructor(private readonly handler: SearchAcademicProgramsByTitleHandler) {}

  @Get(':id/academic-programs/search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      searchAcademicProgramByTitleSchema,
    ),
    new JoiRequestParamIdValidationPipeService(
      searchAcademicProgramByTitleIdSchema,
    ),
  )
  async searchAcademicProgramsByTitle(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Query() queryParams: SearchAcademicProgramasByTitleQueryParams,
  ): Promise<GetAcademicProgramsByTitleResponse> {
    const query = new SearchAcademicProgramsByTitleQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      id,
      req.user,
      queryParams.text,
    );

    const result = await this.handler.handle(query);

    return GetAcademicProgramsByTitleResponse.create(
      result.items,
      queryParams.page,
      result.total,
      queryParams.limit,
    );
  }
}
