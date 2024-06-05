import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetSubjectCallFinalGradesHandler } from '#student/application/subject-call/get-subject-call-final-grades/get-subject-call-final-grades.handler';

@Controller('/enrollment/subject-call/final-grade')
export class GetSubjectCallFinalGradesController {
  constructor(private readonly handler: GetSubjectCallFinalGradesHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubjectModalities() {
    return await this.handler.handle();
  }
}
