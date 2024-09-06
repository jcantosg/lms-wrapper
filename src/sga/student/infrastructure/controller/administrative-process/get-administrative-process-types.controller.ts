import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { getAllAdministrativeProcessStatus } from '#student/domain/enum/administrative-process-status.enum';

@Controller('administrative-process')
export class GetAllAdministrativeProcessStatusController {
  @Get('status')
  @UseGuards(JwtAuthGuard)
  getAllAdministrativeProcessStatus() {
    return getAllAdministrativeProcessStatus();
  }
}
