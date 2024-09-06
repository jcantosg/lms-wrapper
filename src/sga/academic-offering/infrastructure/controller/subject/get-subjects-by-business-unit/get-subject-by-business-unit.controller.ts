import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetSubjectsByBusinessUnitHandler } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getSubjectsByBusinessUnitSchema } from '#academic-offering/infrastructure/config/validation-schema/get-subjects-by-business-unit.schema';
import { GetSubjectsByBusinessUnitQuery } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.query';
import {
  GetSubjectsByBusinessUnitResponse,
  SubjectByBusinessUnitResponse,
} from '#academic-offering/infrastructure/controller/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.response';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

interface GetSubjectsByBusinessUnitQueryParams {
  businessUnit: string;
  academicProgramId: string;
  subjectType?: SubjectType;
}

@Controller('subject')
export class GetSubjectByBusinessUnitController {
  constructor(private readonly handler: GetSubjectsByBusinessUnitHandler) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getSubjectsByBusinessUnitSchema,
    ),
  )
  async getSubjectByBusinessUnit(
    @Query() queryParams: GetSubjectsByBusinessUnitQueryParams,
    @Request() request: AuthRequest,
  ): Promise<SubjectByBusinessUnitResponse[]> {
    const query = new GetSubjectsByBusinessUnitQuery(
      queryParams.businessUnit,
      queryParams.academicProgramId,
      request.user,
      queryParams.subjectType,
    );
    const response = await this.handler.handle(query);

    return GetSubjectsByBusinessUnitResponse.create(response);
  }
}
