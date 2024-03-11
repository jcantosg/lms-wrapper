import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllSubjectsModalitiesHandler } from '#academic-offering/applicaton/get-all-subject-modalities/get-all-subjects-modalities.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';

@Controller('subject')
export class GetAllSubjectModalitiesController {
  constructor(private readonly handler: GetAllSubjectsModalitiesHandler) {}

  @Get('modality')
  @UseGuards(JwtAuthGuard)
  async getSubjectModalities() {
    return await this.handler.handle();
  }
}
