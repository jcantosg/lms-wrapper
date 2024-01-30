import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { SearchExaminationCentersHandler } from '#business-unit/application/search-examination-centers/search-examination-centers.handler';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { searchExaminationCenterSchema } from '#business-unit/infrastructure/config/validation-schema/search-examination-centers.schema';
import { SearchExaminationCentersQuery } from '#business-unit/application/search-examination-centers/search-examination-centers.query';
import { ExaminationCenterResponse } from '#business-unit/infrastructure/controller/get-examination-center/get-examination-center.response';
import { GetAllExaminationCentersResponse } from '#business-unit/infrastructure/controller/get-all-examination-centers/get-all-examination-centers.response';
import { AuthRequest } from '#shared/infrastructure/http/request';

type SearchExaminationCentersQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('examination-center')
export class SearchExaminationCentersController {
  constructor(private readonly handler: SearchExaminationCentersHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Get('search')
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      searchExaminationCenterSchema,
    ),
  )
  async searchExaminationCenters(
    @Query() queryParams: SearchExaminationCentersQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<ExaminationCenterResponse>> {
    const query = new SearchExaminationCentersQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits.map((bu) => bu.id),
    );

    const response = await this.handler.handle(query);

    return GetAllExaminationCentersResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
