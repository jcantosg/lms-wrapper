import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetSubjectsByAcademicProgramResponse } from '#academic-offering/infrastructure/controller/academic-program/get-subjects-by-academic-program/get-subjects-by-academic-program.response';
import { GetSubjectsByAcademicProgramQuery } from '#academic-offering/applicaton/academic-program/get-subjects-by-academic-program/get-subjects-by-academic-program.query';
import { GetSubjectsByAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/get-subjects-by-academic-program/get-subjects-by-academic-program.handler';

@Controller('academic-program')
export class GetSubjectsByAcademicProgramController {
  constructor(private readonly handler: GetSubjectsByAcademicProgramHandler) {}

  @Get(':id/subject/plain')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getSubjectByAcademicProgram(
    @Param('id') academicProgramId: string,
    @Request() request: AuthRequest,
  ): Promise<GetSubjectsByAcademicProgramResponse[]> {
    const query = new GetSubjectsByAcademicProgramQuery(
      academicProgramId,
      request.user,
    );
    const response = await this.handler.handle(query);

    return GetSubjectsByAcademicProgramResponse.create(response);
  }
}
