import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ListAcademicProgramsByPeriodResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-program-by-period/list-all-academic-program.response';
import { SearchAcademicProgramsByAcademicPeriodQuery } from '#academic-offering/applicaton/search-academic-program-by-period/search-academic-program-by-period.query';
import { SearchAcademicProgramByAcademicPeriodHandler } from '#academic-offering/applicaton/search-academic-program-by-period/search-academic-program-by-period.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { searchAcademicProgramByPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/search-academic-program-by-period.schema';

type SearchAcademicProgramByPeriodQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('academic-period')
export class SearchAcademicProgramByAcademicPeriodController {
  constructor(
    private readonly handler: SearchAcademicProgramByAcademicPeriodHandler,
  ) {}

  @Get(':academicPeriodId/academic-program/search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      searchAcademicProgramByPeriodSchema,
    ),
    new JoiRequestParamIdValidationPipeService(uuidSchema),
  )
  async list(
    @Req() req: AuthRequest,
    @Param('academicPeriodId') academicPeriodId: string,
    @Query() queryParams: SearchAcademicProgramByPeriodQueryParams,
  ): Promise<ListAcademicProgramsByPeriodResponse> {
    const query = new SearchAcademicProgramsByAcademicPeriodQuery(
      academicPeriodId,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const response = await this.handler.handle(query);

    return ListAcademicProgramsByPeriodResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
