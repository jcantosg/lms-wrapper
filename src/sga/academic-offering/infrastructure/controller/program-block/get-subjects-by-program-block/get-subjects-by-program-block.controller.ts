import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetSubjectsByProgramBlockHandler } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetSubjectsByProgramBlockQuery } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.query';
import { GetSubjectsByProgramBlockResponse } from '#academic-offering/infrastructure/controller/program-block/get-subjects-by-program-block/get-subjects-by-program-block.response';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getSubjectsByProgramBlockSchema } from '#academic-offering/infrastructure/config/validation-schema/get-subjects-by-program-block.schema';

interface GetASubjectsByProgramBlockQueryParams {
  orderBy: string;
  orderType: OrderTypes;
}

@Controller('program-block')
export class GetSubjectsByProgramBlockController {
  constructor(private readonly handler: GetSubjectsByProgramBlockHandler) {}

  @Get(':id/subject')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestQueryParamValidationPipeService(
      getSubjectsByProgramBlockSchema,
    ),
  )
  async getSubjectsByProgramBlock(
    @Param('id') programBlockId: string,
    @Request() request: AuthRequest,
    @Query() queryParams: GetASubjectsByProgramBlockQueryParams,
  ) {
    const query = new GetSubjectsByProgramBlockQuery(
      programBlockId,
      request.user,
      queryParams.orderType,
      queryParams.orderBy,
    );
    const subjects = await this.handler.handle(query);

    return GetSubjectsByProgramBlockResponse.create(subjects);
  }
}
