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
import { DeleteCommunicationHandler } from '#student-360/communications/application/delete-communication/delete-communication.handler';
import { DeleteCommunicationCommand } from '#student-360/communications/application/delete-communication/delete-communication.command';

@Controller('student-360')
export class DeleteCommunicationController {
  constructor(private readonly handler: DeleteCommunicationHandler) {}

  @Put('communication/:id/delete-for-student')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async deleteCommunication(
    @Request() req: StudentAuthRequest,
    @Param('id') communicationId: string,
  ) {
    const command = new DeleteCommunicationCommand(communicationId, req.user);

    return await this.handler.handle(command);
  }
}
