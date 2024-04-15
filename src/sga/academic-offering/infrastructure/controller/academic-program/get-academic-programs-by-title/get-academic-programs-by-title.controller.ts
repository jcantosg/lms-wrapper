import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';

import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { GetAcademicProgramsByTitleResponse } from '#academic-offering/infrastructure/controller/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.response';
import { GetAcademicProgramsByTitleHandler } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.handler';
import { GetAcademicProgramsByTitleQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import {
  getAcademicProgramsByTitleIdSchema,
  getAcademicProgramsByTitleSchema,
} from '#academic-offering/infrastructure/config/validation-schema/get-academic-programs-by-title.schema';

interface GetAcademicProgramsByTitleQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
}

@Controller('title')
export class GetAcademicProgramsByTitleController {
  constructor(private readonly handler: GetAcademicProgramsByTitleHandler) {}

  @Get(':id/academic-programs')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(
      getAcademicProgramsByTitleIdSchema,
    ),
    new JoiRequestQueryParamValidationPipeService(
      getAcademicProgramsByTitleSchema,
    ),
  )
  async getAcademicProgramsByTitle(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Query() queryParams: GetAcademicProgramsByTitleQueryParams,
  ): Promise<GetAcademicProgramsByTitleResponse> {
    const query = new GetAcademicProgramsByTitleQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      id,
      req.user,
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
