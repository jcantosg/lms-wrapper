import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { GetStudentHandler } from '#student/application/get-student/get-student.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetStudentQuery } from '#student/application/get-student/get-student.query';
import { GetStudentResponse } from '#student/infrastructure/controller/get-student/get-student.response';

@Controller('student')
export class GetStudentController {
  constructor(private readonly handler: GetStudentHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getStudent(@Param('id') id: string): Promise<GetStudentResponse> {
    const query = new GetStudentQuery(id);
    const student = await this.handler.handle(query);

    return GetStudentResponse.create(student);
  }
}
