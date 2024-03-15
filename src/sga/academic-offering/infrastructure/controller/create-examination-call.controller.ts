import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { createExaminationCallSchema } from '#academic-offering/infrastructure/config/validation-schema/create-examination-call.schema';
import { CreateExaminationCallHandler } from '#academic-offering/applicaton/create-examination-call/create-examination-call.handler';
import { CreateExaminationCallCommand } from '#academic-offering/applicaton/create-examination-call/create-examination-call.command';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';

interface CreateExaminationCallBody {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  timezone: TimeZoneEnum;
  academicPeriodId: string;
}

@Controller('examination-call')
export class CreateExaminationCallController {
  constructor(private readonly handler: CreateExaminationCallHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createExaminationCallSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async createExaminationCall(
    @Body() body: CreateExaminationCallBody,
    @Request() req: AuthRequest,
  ) {
    const command = new CreateExaminationCallCommand(
      body.id,
      body.name,
      body.startDate,
      body.endDate,
      body.timezone,
      body.academicPeriodId,
      req.user.businessUnits.map((bu) => bu.id),
    );

    await this.handler.handle(command);
  }
}
