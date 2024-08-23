import {
  Controller,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { DeleteCommunicationHandler } from '#student-360/communications/application/delete-communication/delete-communication.handler';
import { DeleteCommunicationCommand } from '#student-360/communications/application/delete-communication/delete-communication.command';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { deleteCommunicationsSchema } from '#student-360/communications/infrastructure/config/validation-schema/delete-communications.schema';

type DeleteCommunicationsQueryParams = {
  ids: string[];
};

@Controller('student-360')
export class DeleteCommunicationController {
  constructor(private readonly handler: DeleteCommunicationHandler) {}

  @Put('communications/delete-for-student')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(deleteCommunicationsSchema),
  )
  async deleteCommunication(
    @Request() req: StudentAuthRequest,
    @Query() queryParams: DeleteCommunicationsQueryParams,
  ) {
    const command = new DeleteCommunicationCommand(queryParams.ids, req.user);

    return await this.handler.handle(command);
  }
}
