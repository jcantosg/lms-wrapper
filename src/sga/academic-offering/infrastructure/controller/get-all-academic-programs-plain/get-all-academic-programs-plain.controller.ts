import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAllAcademicProgramsPlainHandler } from '#academic-offering/applicaton/get-all-academic-programs-plain/get-all-academic-programs-plain.handler';
import { getAllAcademicProgramsPlainSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-academic-programs-plain.schema';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAllAcademicProgramsPlainQuery } from '#academic-offering/applicaton/get-all-academic-programs-plain/get-all-academic-programs-plain.query';
import { GetAllAcademicProgramsPlainResponse } from '#academic-offering/infrastructure/controller/get-all-academic-programs-plain/get-all-academic-programs-plain.response';

interface GetAllAcademicProgramPlainQueryParams {
  businessUnit: string;
}

@Controller('academic-program/all')
export class GetAllAcademicProgramsPlainController {
  constructor(private readonly handler: GetAllAcademicProgramsPlainHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAllAcademicProgramsPlainSchema,
    ),
  )
  async getAllAcademicPrograms(
    @Query() queryParams: GetAllAcademicProgramPlainQueryParams,
    @Request() req: AuthRequest,
  ): Promise<any> {
    const query = new GetAllAcademicProgramsPlainQuery(
      queryParams.businessUnit,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetAllAcademicProgramsPlainResponse.create(response);
  }
}
