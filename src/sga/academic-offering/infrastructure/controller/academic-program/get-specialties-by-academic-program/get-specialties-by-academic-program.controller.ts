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
import { GetSpecialtiesByAcademicProgramResponse } from '#academic-offering/infrastructure/controller/academic-program/get-specialties-by-academic-program/get-specialties-by-academic-program.response';
import { GetSpecialtiesByAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/get-specialties-by-academic-program/get-specialties-by-academic-program.handler';
import { GetSpecialtiesByAcademicProgramQuery } from '#academic-offering/applicaton/academic-program/get-specialties-by-academic-program/get-specialties-by-academic-program.query';

@Controller('academic-program')
export class GetSpecialtiesByAcademicProgramController {
  constructor(
    private readonly handler: GetSpecialtiesByAcademicProgramHandler,
  ) {}

  @Get(':id/specialty')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getSpecialtiesByAcademicProgram(
    @Param('id') academicProgramId: string,
    @Request() request: AuthRequest,
  ): Promise<GetSpecialtiesByAcademicProgramResponse[]> {
    const query = new GetSpecialtiesByAcademicProgramQuery(
      academicProgramId,
      request.user,
    );
    const response = await this.handler.handle(query);

    return GetSpecialtiesByAcademicProgramResponse.create(response);
  }
}
