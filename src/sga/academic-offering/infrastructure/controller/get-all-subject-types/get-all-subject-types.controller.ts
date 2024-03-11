import { GetAllSubjectTypesHandler } from '#academic-offering/applicaton/get-all-subject-types/get-all-subject-types.handler';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';

@Controller('subject')
export class GetAllSubjectTypesController {
  constructor(private readonly handler: GetAllSubjectTypesHandler) {}

  @Get('type')
  @UseGuards(JwtAuthGuard)
  async getAllSubjectTypes() {
    return await this.handler.handle();
  }
}
