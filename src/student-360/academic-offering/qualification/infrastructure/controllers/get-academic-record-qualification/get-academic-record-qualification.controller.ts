import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetAcademicRecordQualificationHandler } from '#student-360/academic-offering/qualification/application/get-academic-record-qualification/get-academic-record-qualification.handler';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetAcademicRecordQualificationQuery } from '#student-360/academic-offering/qualification/application/get-academic-record-qualification/get-academic-record-qualification.query';
import {
  GetAcademicRecordQualificationResponse,
  GetAcademicRecordQualificationResponseBody,
} from '#student-360/academic-offering/qualification/infrastructure/controllers/get-academic-record-qualification/get-academic-record-qualification.response';

@Controller('student-360')
export class GetAcademicRecordQualificationController {
  constructor(
    private readonly handler: GetAcademicRecordQualificationHandler,
  ) {}

  @Get('qualification/:id')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getAcademicRecordQualification(
    @Param('id') academicRecordId: string,
    @Request() req: StudentAuthRequest,
  ): Promise<GetAcademicRecordQualificationResponseBody[]> {
    const query = new GetAcademicRecordQualificationQuery(
      academicRecordId,
      req.user,
    );
    const subjectCalls = await this.handler.handle(query);

    return GetAcademicRecordQualificationResponse.create(subjectCalls);
  }
}
