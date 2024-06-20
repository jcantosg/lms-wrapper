import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetInternalGroupDetailResponse } from '#student/infrastructure/controller/internal-group/get-internal-group-detail/get-internal-group-detail.response';
import { GetInternalGroupDetailHandler } from '#student/application/get-internal-group-detail/get-internal-group-detail.handler';
import { GetInternalGroupDetailQuery } from '#student/application/get-internal-group-detail/get-internal-group-detail.query';

@Controller('internal-group')
export class GetInternalGroupDetailController {
  constructor(private readonly handler: GetInternalGroupDetailHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':id')
  async getInternalGroupDetail(
    @Param('id') internalGroupId: string,
    @Request() request: AuthRequest,
  ) {
    const query = new GetInternalGroupDetailQuery(
      internalGroupId,
      request.user,
    );
    const internalGroup = await this.handler.handle(query);

    return GetInternalGroupDetailResponse.create(internalGroup);
  }
}
