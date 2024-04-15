import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import {
  CreateAcademicPeriodCommand,
  ExaminationCallValues,
} from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.command';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { createAcademicPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/create-academic-period.schema';

interface CreateAcademicPeriodBody {
  id: string;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  businessUnit: string;
  examinationCalls: ExaminationCallValues[];
  blocksNumber: number;
}

@Controller('academic-period')
export class CreateAcademicPeriodController {
  constructor(private readonly handler: CreateAcademicPeriodHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createAcademicPeriodSchema))
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  async createAcademicPeriod(
    @Body() body: CreateAcademicPeriodBody,
    @Req() req: AuthRequest,
  ) {
    const command = new CreateAcademicPeriodCommand(
      body.id,
      body.name,
      body.code,
      body.startDate,
      body.endDate,
      body.businessUnit,
      body.examinationCalls,
      body.blocksNumber,
      req.user.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      req.user,
    );

    await this.handler.handle(command);
  }
}
