import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { editCommunicationSchema } from '#shared/infrastructure/config/validation-schema/edit-communication.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { SendCommunicationCommand } from '#shared/application/communication/send-communication/send-communication.command';
import { SendCommunicationHandler } from '#shared/application/communication/send-communication/send-communication.handler';

interface SendCommunicationBody {
  businessUnitIds: string[];
  academicPeriodIds: string[];
  titleIds: string[];
  academicProgramIds: string[];
  internalGroupIds: string[];
  studentIds: string[];
  subject: string;
  shortDescription: string;
  body: string;
  sendByEmail: boolean;
  publishOnBoard: boolean;
}

@Controller('communication')
export class SendCommunicationController {
  constructor(private readonly handler: SendCommunicationHandler) {}

  @Put(':id/send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestBodyValidationPipe(editCommunicationSchema),
    new JoiRequestParamIdValidationPipeService(uuidSchema),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async sendCommunication(
    @Param('id') id: string,
    @Body() body: SendCommunicationBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new SendCommunicationCommand(
      id,
      body.businessUnitIds,
      body.academicPeriodIds,
      body.titleIds,
      body.academicProgramIds,
      body.internalGroupIds,
      body.studentIds,
      body.subject,
      body.shortDescription,
      body.body,
      body.sendByEmail,
      body.publishOnBoard,
      request.user,
    );
    await this.handler.handle(command);
  }
}
