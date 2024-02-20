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
import { GetAllExaminationCentersHandler } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.handler';
import { getAllExaminationCentersSchema } from '#business-unit/infrastructure/config/validation-schema/get-all-examination-centers.schema';
import { GetAllExaminationCentersQuery } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.query';
import { GetAllExaminationCentersResponse } from '#business-unit/infrastructure/controller/examination-center/get-all-examination-centers/get-all-examination-centers.response';
import { ExaminationCenterResponse } from '#business-unit/infrastructure/controller/examination-center/get-examination-center/get-examination-center.response';
import { AuthRequest } from '#shared/infrastructure/http/request';

type GetAllExaminationCentersQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  code?: string;
  isActive?: boolean;
  country?: string;
  address?: string;
  businessUnit?: string[];
  classroom?: string[];
};

@Controller('examination-center')
export class GetAllExaminationCentersController {
  constructor(private readonly handler: GetAllExaminationCentersHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAllExaminationCentersSchema,
    ),
  )
  async getAllExaminationCenters(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllExaminationCentersQueryParams,
  ): Promise<CollectionResponse<ExaminationCenterResponse>> {
    const query = new GetAllExaminationCentersQuery(
      req.user.businessUnits,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.code,
      queryParams.isActive,
      queryParams.address,
      queryParams.country,
      queryParams.businessUnit,
      queryParams.classroom,
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
