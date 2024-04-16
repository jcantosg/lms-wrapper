import {
  Controller,
  Get,
  Param,
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

@Controller('program-block')
export class GetSubjectsByProgramBlockController {
  constructor(private readonly handler: GetSubjectsByProgramBlockHandler) {}

  @Get(':id/subject')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getSubjectsByProgramBlock(
    @Param('id') programBlockId: string,
    @Request() request: AuthRequest,
  ) {
    const query = new GetSubjectsByProgramBlockQuery(
      programBlockId,
      request.user,
    );
    const subjects = await this.handler.handle(query);

    return GetSubjectsByProgramBlockResponse.create(subjects);
  }
}
