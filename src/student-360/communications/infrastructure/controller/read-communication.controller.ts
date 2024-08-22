import {
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { ReadCommunicationHandler } from '#student-360/communications/application/read-communication/read-communication.handler';
import { ReadCommunicationCommand } from '#student-360/communications/application/read-communication/read-communication.command';

@Controller('student-360')
export class ReadCommunicationController {
  constructor(private readonly handler: ReadCommunicationHandler) {}

  @Put('communication/:id')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async readCommunication(
    @Request() req: StudentAuthRequest,
    @Param('id') communicationId: string,
  ) {
    const command = new ReadCommunicationCommand(communicationId, req.user);

    return await this.handler.handle(command);
  }
}
