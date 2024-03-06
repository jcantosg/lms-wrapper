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
import { SearchAcademicPeriodsHandler } from '#academic-offering/applicaton/search-academic-periods/search-academic-periods.handler';
import { AcademicPeriodResponse } from '#academic-offering/infrastructure/controller/get-academic-period.response';
import { SearchAcademicPeriodsQuery } from '#academic-offering/applicaton/search-academic-periods/search-academic-periods.query';
import { GetAllAcademicPeriodsResponse } from '#academic-offering/infrastructure/controller/get-all-academic-periods/get-all-academic-periods.response';
import { searchAcademicPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/search-academic-periods.schema';

type SearchAcademicPeriodsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('academic-period')
export class SearchAcademicPeriodsController {
  constructor(private readonly handler: SearchAcademicPeriodsHandler) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchAcademicPeriodSchema),
  )
  async searchAcademicPeriods(
    @Query() queryParams: SearchAcademicPeriodsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<AcademicPeriodResponse>> {
    const query = new SearchAcademicPeriodsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const response = await this.handler.handle(query);

    return GetAllAcademicPeriodsResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
