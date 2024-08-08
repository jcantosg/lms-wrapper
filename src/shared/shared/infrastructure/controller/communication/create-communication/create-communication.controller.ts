import {
  Body,
  Controller,
  Post,
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
import { CreateCommunicationHandler } from '#shared/application/communication/create-communication/create-communication.handler';
import { CreateCommunicationCommand } from '#shared/application/communication/create-communication/create-communication.command';
import { createCommunicationSchema } from '#shared/infrastructure/config/validation-schema/create-communication.schema';
import { CreateCommunicationResponse } from '#shared/infrastructure/controller/communication/create-communication/create-communication.response';

interface CreateCommunicationBody {
  id: string;
  businessUnitIds: string[];
  academicPeriodIds: string[];
  titleIds: string[];
  academicProgramIds: string[];
  internalGroupIds: string[];
  studentIds: string[];
}

@Controller('communication')
export class CreateCommunicationController {
  constructor(private readonly handler: CreateCommunicationHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createCommunicationSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async createCommunication(
    @Body() body: CreateCommunicationBody,
    @Request() request: AuthRequest,
  ): Promise<CreateCommunicationResponse> {
    const command = new CreateCommunicationCommand(
      body.id,
      body.businessUnitIds,
      body.academicPeriodIds,
      body.titleIds,
      body.academicProgramIds,
      body.internalGroupIds,
      body.studentIds,
      request.user,
    );
    const studentCount = await this.handler.handle(command);

    return CreateCommunicationResponse.create(studentCount);
  }
}
