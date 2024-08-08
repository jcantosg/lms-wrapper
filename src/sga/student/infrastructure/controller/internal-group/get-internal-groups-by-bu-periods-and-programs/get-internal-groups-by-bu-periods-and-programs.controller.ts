import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetInternalGroupsByBuPeriodsAndProgramsQuery } from '#student/application/get-internal-groups-by-bu-periods-and-programs/get-internal-groups-by-bu-periods-and-programs.query';
import { GetInternalGroupsByBuPeriodsAndProgramsHandler } from '#student/application/get-internal-groups-by-bu-periods-and-programs/get-internal-groups-by-bu-periods-and-programs.handler';
import { GetInternalGroupsByBuPeriodsAndProgramsResponse } from '#student/infrastructure/controller/internal-group/get-internal-groups-by-bu-periods-and-programs/get-internal-groups-by-bu-periods-and-programs.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getInternalGroupsByBuPeriodsAndProgramsSchema } from '#academic-offering/infrastructure/config/validation-schema/get-internal-groups-by-bu-periods-and-programs.schema';

type GetInternalGroupsByParamsQueryParams = {
  businessUnitIds: string[];
  academicPeriodIds: string[];
  academicProgramIds: string[];
};

@Controller('internal-group')
export class GetInternalGroupsByBuPeriodsAndProgramsController {
  constructor(
    private readonly handler: GetInternalGroupsByBuPeriodsAndProgramsHandler,
  ) {}

  @Get('by-bu-periods-and-programs')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getInternalGroupsByBuPeriodsAndProgramsSchema,
    ),
  )
  async getInternalGroups(
    @Query() queryParams: GetInternalGroupsByParamsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<{ id: string; name: string }[]> {
    const { businessUnitIds, academicPeriodIds, academicProgramIds } =
      queryParams;

    const query = new GetInternalGroupsByBuPeriodsAndProgramsQuery(
      businessUnitIds,
      academicPeriodIds,
      academicProgramIds,
      req.user.businessUnits.map((bu) => bu.id),
    );
    const response = await this.handler.handle(query);

    return GetInternalGroupsByBuPeriodsAndProgramsResponse.create(response);
  }
}
