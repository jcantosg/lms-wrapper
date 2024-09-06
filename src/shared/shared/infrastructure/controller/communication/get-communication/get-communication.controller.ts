import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetCommunicationResponse } from '#shared/infrastructure/controller/communication/get-communication/get-communication.response';
import { GetCommunicationHandler } from '#shared/application/communication/get-communication/get-communication.handler';
import { GetCommunicationQuery } from '#shared/application/communication/get-communication/get-communication.query';

@Controller('communication')
export class GetCommunicationController {
  constructor(private readonly handler: GetCommunicationHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getCommunication(@Param('id') id: string) {
    const query = new GetCommunicationQuery(id);

    const response = await this.handler.handle(query);

    return GetCommunicationResponse.create(response);
  }
}
