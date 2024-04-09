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
import { SubjectResponse } from '#academic-offering/infrastructure/controller/subject/get-all-subjects/get-subject.response';
import { GetAllSubjectsResponse } from '#academic-offering/infrastructure/controller/subject/get-all-subjects/get-all-subject.response';
import { searchSubjectsSchema } from '#academic-offering/infrastructure/config/validation-schema/search-subjects.schema';
import { SearchSubjectsHandler } from '#academic-offering/applicaton/subject/search-subjects/search-subjects.handler';
import { SearchSubjectsQuery } from '#academic-offering/applicaton/subject/search-subjects/search-subjects.query';

type SearchSubjectsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('subject')
export class SearchSubjectsController {
  constructor(private readonly handler: SearchSubjectsHandler) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @UsePipes(new JoiRequestQueryParamValidationPipeService(searchSubjectsSchema))
  async searchSubjects(
    @Query() queryParams: SearchSubjectsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<SubjectResponse>> {
    const query = new SearchSubjectsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
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
