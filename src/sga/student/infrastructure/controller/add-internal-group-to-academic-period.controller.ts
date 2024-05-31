import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { addInternalGroupToAcademicPeriodSchema } from '#student/infrastructure/config/validation-schema/add-internal-group-to-academic-period.schema';
import { AddInternalGroupToAcademicPeriodCommand } from '#student/application/add-internal-group-to-academic-period/add-internal-group-to-academic-period.command';
import { AddInternalGroupToAcademicPeriodHandler } from '#student/application/add-internal-group-to-academic-period/add-internal-group-to-academic-period.handler';

interface AddInternalGroupToAcademicPeriodBody {
  id: string;
  academicPeriodId: string;
  prefix?: string;
  sufix?: string;
  academicProgramId: string;
  subjectId: string;
  edaeUserIds: string[];
  isDefaultGroup: boolean;
}

@Controller('internal-group')
export class AddInternalGroupToAcademicPeriodController {
  constructor(
    private readonly handler: AddInternalGroupToAcademicPeriodHandler,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestBodyValidationPipe(addInternalGroupToAcademicPeriodSchema),
  )
  async addInternalGroupToAcademicPeriod(
    @Body() body: AddInternalGroupToAcademicPeriodBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new AddInternalGroupToAcademicPeriodCommand(
      body.id,
      body.academicPeriodId,
      body.prefix ?? null,
      body.sufix ?? null,
      body.academicProgramId,
      body.subjectId,
      body.edaeUserIds,
      body.isDefaultGroup,
      request.user,
    );
    await this.handler.handle(command);
  }
}
