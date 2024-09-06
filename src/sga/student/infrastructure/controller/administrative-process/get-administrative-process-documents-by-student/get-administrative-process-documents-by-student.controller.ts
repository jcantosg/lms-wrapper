import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import {
  GetStudentAdministrativeProcessDocumentsResponse,
  StudentAdministrativeProcessDocumentsResponse,
} from '#student/infrastructure/controller/administrative-process/get-administrative-process-documents-by-student/get-administrative-process-documents-by-student.response';
import { GetStudentAdministrativeProcessDocumentsQuery } from '#student/application/administrative-process/get-student-administrative-process-documents/get-student-administrative-process-documents.query';
import { GetStudentAdministrativeProcessDocumentsHandler } from '#student/application/administrative-process/get-student-administrative-process-documents/get-student-administrative-process-documents.handler';

@Controller('student')
export class GetStudentAdministrativeProcessDocumentsController {
  constructor(
    private readonly handler: GetStudentAdministrativeProcessDocumentsHandler,
  ) {}

  @Get(':id/documents')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getStudentAdministrativeProcessDocuments(
    @Req() req: AuthRequest,
    @Param('id') studentId: string,
  ): Promise<StudentAdministrativeProcessDocumentsResponse> {
    const query = new GetStudentAdministrativeProcessDocumentsQuery(
      req.user,
      studentId,
    );

    const response = await this.handler.handle(query);

    return GetStudentAdministrativeProcessDocumentsResponse.create(response);
  }
}
