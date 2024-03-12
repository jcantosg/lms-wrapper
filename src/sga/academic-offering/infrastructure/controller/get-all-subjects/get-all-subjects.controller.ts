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
import { GetAllSubjectsHandler } from '#academic-offering/applicaton/get-all-subjects/get-all-subjects.handler';
import { SubjectResponse } from '#academic-offering/infrastructure/controller/get-all-subjects/get-subject.response';
import { GetAllSubjectsQuery } from '#academic-offering/applicaton/get-all-subjects/get-all-subjects.query';
import { GetAllSubjectsResponse } from '#academic-offering/infrastructure/controller/get-all-subjects/get-all-subject.response';
import { getAllSubjectsSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-subjects.schema';

type GetAllSubjectsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  code?: string;
  officialCode?: string;
  modality?: string;
  evaluationType?: string;
  type?: string;
  businessUnit?: string;
  isRegulated?: boolean;
};

@Controller('subject')
export class GetAllSubjectsController {
  constructor(private readonly handler: GetAllSubjectsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestQueryParamValidationPipeService(getAllSubjectsSchema))
  async getAllSubjects(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllSubjectsQueryParams,
  ): Promise<CollectionResponse<SubjectResponse>> {
    const query = new GetAllSubjectsQuery(
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.code,
      queryParams.officialCode,
      queryParams.modality,
      queryParams.evaluationType,
      queryParams.type,
      queryParams.businessUnit,
      queryParams.isRegulated,
    );

    const response = await this.handler.handle(query);

    return GetAllSubjectsResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
