import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { getAllAdministrativeProcessTypes } from '#student/domain/enum/administrative-process-type.enum';

@Controller('administrative-process')
export class GetAllAdministrativeProcessTypesController {
  @Get('type')
  @UseGuards(JwtAuthGuard)
  getAllAdministrativeProcessTypes() {
    return getAllAdministrativeProcessTypes();
  }
}
