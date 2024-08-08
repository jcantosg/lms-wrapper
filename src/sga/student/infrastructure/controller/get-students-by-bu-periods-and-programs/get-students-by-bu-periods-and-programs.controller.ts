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
import { GetStudentsByBuPeriodsAndProgramsQuery } from '#student/application/get-students-by-bu-periods-and-programs/get-students-by-bu-periods-and-programs.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { GetStudentsByBuPeriodsAndProgramsResponse } from '#student/infrastructure/controller/get-students-by-bu-periods-and-programs/get-students-by-bu-periods-and-programs.response';
import { GetStudentsByBuPeriodsAndProgramsHandler } from '#student/application/get-students-by-bu-periods-and-programs/get-students-by-bu-periods-and-programs.handler';
import { getStudentsByBuPeriodsAndProgramsSchema } from '#student/infrastructure/config/validation-schema/get-students-by-bu-periods-and-programs.schema';

type GetStudentsByParamsQueryParams = {
  businessUnitIds: string[];
  academicPeriodIds: string[];
  academicProgramIds: string[];
};

@Controller('student')
export class GetStudentsByBuPeriodsAndProgramsController {
  constructor(
    private readonly handler: GetStudentsByBuPeriodsAndProgramsHandler,
  ) {}

  @Get('/by-bu-periods-and-programs')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getStudentsByBuPeriodsAndProgramsSchema,
    ),
  )
  async getStudents(
    @Query() queryParams: GetStudentsByParamsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<GetStudentsByBuPeriodsAndProgramsResponse[]> {
    const { businessUnitIds, academicPeriodIds, academicProgramIds } =
      queryParams;

    const query = new GetStudentsByBuPeriodsAndProgramsQuery(
      businessUnitIds,
      academicPeriodIds,
      academicProgramIds,
      req.user.businessUnits.map((bu) => bu.id),
    );
    const response = await this.handler.handle(query);

    return GetStudentsByBuPeriodsAndProgramsResponse.create(response);
  }
}
