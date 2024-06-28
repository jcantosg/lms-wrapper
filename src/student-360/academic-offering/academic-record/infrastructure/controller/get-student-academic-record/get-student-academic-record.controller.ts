import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetStudentAcademicRecordHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { GetStudentAcademicRecordQuery } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.query';
import { GetStudentAcademicRecordResponse } from '#student-360/academic-offering/academic-record/infrastructure/controller/get-student-academic-record/get-student-academic-record.response';

@Controller('student-360')
export class GetStudentAcademicRecordController {
  constructor(private readonly handler: GetStudentAcademicRecordHandler) {}

  @Get('academic-record/:id')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getStudentAcademicRecord(
    @Param('id') id: string,
    @Request() req: StudentAuthRequest,
  ): Promise<GetStudentAcademicRecordResponse> {
    const query = new GetStudentAcademicRecordQuery(id, req.user);
    const academicRecord = await this.handler.handle(query);

    return GetStudentAcademicRecordResponse.create(academicRecord);
  }
}
