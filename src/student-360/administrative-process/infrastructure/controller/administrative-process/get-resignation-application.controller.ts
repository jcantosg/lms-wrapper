import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getResignationApplicationSchema } from '#student-360/administrative-process/infrastructure/config/validation-schema/get-resignation-application.schema';
import { GetResignationApplicationQuery } from '#student-360/administrative-process/application/get-resignation-application/get-resignation-application.query';
import { GetResignationApplicationHandler } from '#student-360/administrative-process/application/get-resignation-application/get-resignation-application.handler';

type GetResignationApplicationQueryParams = {
  academicRecord: string;
};

@Controller('student-360')
export class GetResignationApplicationController {
  constructor(private readonly handler: GetResignationApplicationHandler) {}

  @Get('administrative-process/resignation-application')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getResignationApplicationSchema,
    ),
  )
  async getResignationApplication(
    @Req() req: StudentAuthRequest,
    @Query() queryParams: GetResignationApplicationQueryParams,
  ): Promise<string> {
    const query = new GetResignationApplicationQuery(
      queryParams.academicRecord,
      req.user,
    );

    return await this.handler.handle(query);
  }
}
