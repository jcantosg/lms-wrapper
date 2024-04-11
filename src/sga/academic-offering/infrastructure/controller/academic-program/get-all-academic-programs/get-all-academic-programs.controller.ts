import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllAcademicProgramsResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-programs/get-all-academic-programs.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getAllAcademicProgramsSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-academic-programs.schema';
import { GetAllAcademicProgramsHandler } from '#academic-offering/applicaton/academic-program/get-all-academic-programs/get-all-academic-programs.handler';
import { GetAllAcademicProgramsQuery } from '#academic-offering/applicaton/academic-program/get-all-academic-programs/get-all-academic-programs.query';

interface GetAllAcademicProgramQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name: string | null;
  code: string | null;
  title: string | null;
  businessUnit: string | null;
}

@Controller('academic-program')
export class GetAllAcademicProgramsController {
  constructor(private readonly handler: GetAllAcademicProgramsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllAcademicProgramsSchema),
  )
  async getAllAcademicPrograms(
    @Query() queryParams: GetAllAcademicProgramQueryParams,
    @Request() req: AuthRequest,
  ): Promise<GetAllAcademicProgramsResponse> {
    const query = new GetAllAcademicProgramsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.title,
      queryParams.code,
      queryParams.businessUnit,
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
