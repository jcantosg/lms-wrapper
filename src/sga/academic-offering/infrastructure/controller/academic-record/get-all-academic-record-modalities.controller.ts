import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAllAcademicRecordModalitiesHandler } from '#academic-offering/applicaton/academic-record/get-all-academic-record-modalities/get-all-academic-record-modalities.handler';

@Controller('academic-record')
export class GetAllAcademicRecordModalitiesController {
  constructor(
    private readonly handler: GetAllAcademicRecordModalitiesHandler,
  ) {}

  @Get('modality')
  @UseGuards(JwtAuthGuard)
  async getSubjectModalities() {
    return await this.handler.handle();
  }
}
