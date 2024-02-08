import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateExaminationCenterHandler } from '#business-unit/application/examination-center/create-examination-center/create-examination-center.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createExaminationCenterSchema } from '#business-unit/infrastructure/config/validation-schema/create-examination-center.schema';
import { CreateExaminationCenterCommand } from '#business-unit/application/examination-center/create-examination-center/create-examination-center.command';

type CreateExaminationCenterBody = {
  id: string;
  name: string;
  code: string;
  businessUnits: string[];
  address: string;
  countryId: string;
};

@Controller('examination-center')
export class CreateExaminationCenterController {
  constructor(private handler: CreateExaminationCenterHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(new JoiRequestBodyValidationPipe(createExaminationCenterSchema))
  @Post()
  async createExaminationCenter(
    @Request() req: AuthRequest,
    @Body() body: CreateExaminationCenterBody,
  ) {
    const command = new CreateExaminationCenterCommand(
      body.id,
      body.name,
      body.code,
      body.businessUnits,
      body.address,
      req.user,
      body.countryId,
    );
    await this.handler.handle(command);
  }
}
