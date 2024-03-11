import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetEvaluationTypesHandler } from '#academic-offering/applicaton/get-evaluation-types/get-evaluation-types.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetEvaluationTypesQuery } from '#academic-offering/applicaton/get-evaluation-types/get-evaluation-types.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getEvaluationTypesSchema } from '#academic-offering/infrastructure/config/validation-schema/get-evaluation-types.schema';
import { GetEvaluationTypesResponse } from '#academic-offering/infrastructure/controller/get-evaluation-types/get-evaluation-types.response';
import { AuthRequest } from '#shared/infrastructure/http/request';

@Controller('subject')
export class GetEvaluationTypesController {
  constructor(private readonly handler: GetEvaluationTypesHandler) {}

  @Get('evaluation-type')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getEvaluationTypesSchema),
  )
  async getEvaluationTypes(
    @Query('businessUnit') businessUnitId: string,
    @Request() req: AuthRequest,
  ) {
    const query = new GetEvaluationTypesQuery(businessUnitId, req.user);

    return GetEvaluationTypesResponse.create(await this.handler.handle(query));
  }
}
