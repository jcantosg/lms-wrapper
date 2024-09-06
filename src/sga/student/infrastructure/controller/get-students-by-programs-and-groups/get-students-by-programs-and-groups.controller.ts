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
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { GetStudentsByProgramsAndGroupsResponse } from '#student/infrastructure/controller/get-students-by-programs-and-groups/get-students-by-programs-and-groups.response';
import { GetStudentsByProgramsAndGroupsHandler } from '#student/application/get-students-by-programs-and-groups/get-students-by-programs-and-groups.handler';
import { getStudentsByProgramsAndGroupsSchema } from '#student/infrastructure/config/validation-schema/get-students-by-programs-and-groups.schema';
import { GetStudentsByProgramsAndGroupsQuery } from '#student/application/get-students-by-programs-and-groups/get-students-by-programs-and-groups.query';

type GetStudentsByParamsQueryParams = {
  academicProgramIds: string[];
  internalGroupIds?: string[];
};

@Controller('student')
export class GetStudentsByProgramsAndGroupsController {
  constructor(
    private readonly handler: GetStudentsByProgramsAndGroupsHandler,
  ) {}

  @Get('/by-programs')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getStudentsByProgramsAndGroupsSchema,
    ),
  )
  async getStudents(
    @Query() queryParams: GetStudentsByParamsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<GetStudentsByProgramsAndGroupsResponse[]> {
    const { academicProgramIds, internalGroupIds } = queryParams;

    const query = new GetStudentsByProgramsAndGroupsQuery(
      academicProgramIds,
      internalGroupIds ?? [],
      req.user,
    );
    const response = await this.handler.handle(query);

    return GetStudentsByProgramsAndGroupsResponse.create(response);
  }
}
