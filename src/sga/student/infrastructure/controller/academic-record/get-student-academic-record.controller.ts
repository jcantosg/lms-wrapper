import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetStudentAcademicRecordResponse } from '#student/infrastructure/controller/academic-record/get-student-academic-record.response';
import { GetStudentAcademicRecordHandler } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.handler';
import { GetStudentAcademicRecordQuery } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.query';

@Controller('student')
export class GetStudentAcademicRecordController {
  constructor(private readonly handler: GetStudentAcademicRecordHandler) {}

  @Get(':id/academic-record')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getStudentAcademicRecord(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<GetStudentAcademicRecordResponse> {
    const query = new GetStudentAcademicRecordQuery(id, req.user);
    const studentAcademicRecords = await this.handler.handle(query);

    return GetStudentAcademicRecordResponse.create(studentAcademicRecords);
  }
}
