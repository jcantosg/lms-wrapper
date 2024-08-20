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
import { CreateCommunicationResponse } from '#shared/infrastructure/controller/communication/create-communication/create-communication.response';
import { editCommunicationSchema } from '#shared/infrastructure/config/validation-schema/edit-communication.schema';
import { EditCommunicationCommand } from '#shared/application/communication/edit-communication/edit-communication.command';
import { EditCommunicationHandler } from '#shared/application/communication/edit-communication/edit-communication.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';

interface EditCommunicationBody {
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
export class EditCommunicationController {
  constructor(private readonly handler: EditCommunicationHandler) {}

  @Put(':id')
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
  async editCommunication(
    @Param('id') id: string,
    @Body() body: EditCommunicationBody,
    @Request() request: AuthRequest,
  ): Promise<CreateCommunicationResponse> {
    const command = new EditCommunicationCommand(
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
    const studentCount = await this.handler.handle(command);

    return CreateCommunicationResponse.create(studentCount);
  }
}
