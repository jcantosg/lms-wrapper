import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editChatroomSchema } from '#shared/infrastructure/config/validation-schema/edit-chatroom.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { EditChatroomCommand } from '#shared/application/edit-chatroom/edit-chatroom.command';
import { EditChatroomHandler } from '#shared/application/edit-chatroom/edit-chatroom.handler';

interface EditChatroomBody {
  chatroomId: string;
}

@Controller('student-360')
export class EditChatroomController {
  constructor(private readonly handler: EditChatroomHandler) {}

  @Put('chatroom/:id')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editChatroomSchema),
  )
  async editChatroom(
    @Param('id') id: string,
    @Body() body: EditChatroomBody,
  ): Promise<void> {
    const command = new EditChatroomCommand(id, body.chatroomId);

    return await this.handler.handle(command);
  }
}
