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
import { GetAllAcademicProgramsByPeriodQuery } from '#academic-offering/applicaton/get-all-academic-programs-by-period/get-all-academic-programs-by-period.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ListAcademicProgramsByPeriodResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-program-by-period/list-all-academic-program.response';
import { GetAllAcademicProgramByAcademicPeriodHandler } from '#academic-offering/applicaton/get-all-academic-programs-by-period/get-all-academic-programs-by-period.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { listAcademicProgramByPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-academic-program-by-period.schema';

type ListAcademicProgramByPeriodQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
};

@Controller('academic-period')
export class GetAllAcademicProgramByAcademicPeriodController {
  constructor(
    private readonly handler: GetAllAcademicProgramByAcademicPeriodHandler,
  ) {}

  @Get(':academicPeriodId/academic-program')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      listAcademicProgramByPeriodSchema,
    ),
    new JoiRequestParamIdValidationPipeService(uuidSchema),
  )
  async list(
    @Req() req: AuthRequest,
    @Param('academicPeriodId') academicPeriodId: string,
    @Query() queryParams: ListAcademicProgramByPeriodQueryParams,
  ): Promise<ListAcademicProgramsByPeriodResponse> {
    const query = new GetAllAcademicProgramsByPeriodQuery(
      academicPeriodId,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
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
