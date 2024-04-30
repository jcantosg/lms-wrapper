import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AcademicRecordModalityEnum } from '#academic-offering/domain/enum/academic-record-modality.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CreateAcademicRecordCommand } from '#student/application/academic-record/create-academic-record/create-academic-record.command';
import { CreateAcademicRecordHandler } from '#student/application/academic-record/create-academic-record/create-academic-record.handler';
import { createAcademicRecordSchema } from '#student/infrastructure/config/validation-schema/create-academic-record.schema';

interface CreateAcademicRecordBody {
  id: string;
  businessUnitId: string;
  virtualCampusId: string;
  studentId: string;
  academicPeriodId: string;
  academicProgramId: string;
  academicRecordModality: AcademicRecordModalityEnum;
  isModular: boolean;
}

@Controller('academic-record')
export class CreateAcademicRecordController {
  constructor(private readonly handler: CreateAcademicRecordHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(createAcademicRecordSchema))
  async createAcademicRecord(
    @Body() body: CreateAcademicRecordBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new CreateAcademicRecordCommand(
      body.id,
      body.businessUnitId,
      body.virtualCampusId,
      body.studentId,
      body.academicPeriodId,
      body.academicProgramId,
      body.academicRecordModality,
      body.isModular,
      req.user,
    );

    await this.handler.handle(command);
  }
}
