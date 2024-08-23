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
import { getAcademicRecognitionApplicationSchema } from '#student-360/administrative-process/infrastructure/config/validation-schema/get-academic-recognition-application.schema';
import { GetAcademicRecognitionApplicationQuery } from '#student-360/administrative-process/application/get-academic-recognition-application/get-academic-recognition-application.query';
import { GetAcademicRecognitionApplicationHandler } from '#student-360/administrative-process/application/get-academic-recognition-application/get-academic-recognition-application.handler';

type GetAcademicRecognitionApplicationQueryParams = {
  academicRecord: string;
};

@Controller('student-360')
export class GetAcademicRecognitionApplicationController {
  constructor(
    private readonly handler: GetAcademicRecognitionApplicationHandler,
  ) {}

  @Get('administrative-process/academic-recognition-application')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAcademicRecognitionApplicationSchema,
    ),
  )
  async getAcademicRecognitionApplication(
    @Req() req: StudentAuthRequest,
    @Query() queryParams: GetAcademicRecognitionApplicationQueryParams,
  ): Promise<string> {
    const query = new GetAcademicRecognitionApplicationQuery(
      queryParams.academicRecord,
      req.user,
    );

    return await this.handler.handle(query);
  }
}
