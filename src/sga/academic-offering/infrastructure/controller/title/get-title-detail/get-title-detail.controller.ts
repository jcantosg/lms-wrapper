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
import { GetTitleDetailResponse } from '#academic-offering/infrastructure/controller/title/get-title-detail/get-title-detail.response';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetTitleDetailHandler } from '#academic-offering/applicaton/title/get-title-detail/get-title-detail.handler';
import { GetTitleDetailQuery } from '#academic-offering/applicaton/title/get-title-detail/get-title-detail.query';

@Controller('title')
export class GetTitleDetailController {
  constructor(private readonly handler: GetTitleDetailHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':id')
  async getTitleDetail(
    @Param('id') id: string,
    @Request() request: AuthRequest,
  ) {
    const query = new GetTitleDetailQuery(id, request.user);
    const titleDetail = await this.handler.handle(query);

    return GetTitleDetailResponse.create(titleDetail);
  }
}
