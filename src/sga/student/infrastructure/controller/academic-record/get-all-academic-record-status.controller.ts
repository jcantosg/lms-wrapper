import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAllAcademicRecordStatusHandler } from '#student/application/academic-record/get-all-academic-record-status/get-all-academic-record-status.handler';

@Controller('academic-record')
export class GetAllAcademicRecordStatusController {
  constructor(private readonly handler: GetAllAcademicRecordStatusHandler) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getSubjectStatus() {
    return await this.handler.handle();
  }
}
