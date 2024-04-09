import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAllSubjectsModalitiesHandler } from '#academic-offering/applicaton/subject/get-all-subject-modalities/get-all-subjects-modalities.handler';

@Controller('subject')
export class GetAllSubjectModalitiesController {
  constructor(private readonly handler: GetAllSubjectsModalitiesHandler) {}

  @Get('modality')
  @UseGuards(JwtAuthGuard)
  async getSubjectModalities() {
    return await this.handler.handle();
  }
}
