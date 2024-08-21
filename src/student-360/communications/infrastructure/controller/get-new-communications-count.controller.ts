import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { GetNewCommunicationsCountQuery } from '#student-360/communications/application/get-new-communications-count/get-new-communications-count.query';
import { GetNewCommunicationsCountHandler } from '#student-360/communications/application/get-new-communications-count/get-new-communications-count.handler';

@Controller('student-360')
export class GetNewCommunicationsCountController {
  constructor(private readonly handler: GetNewCommunicationsCountHandler) {}

  @Get('communication/not-read')
  @UseGuards(StudentJwtAuthGuard)
  async getStudentCommunications(@Request() req: StudentAuthRequest) {
    const query = new GetNewCommunicationsCountQuery(req.user);

    return {
      notReadCommunications: await this.handler.handle(query),
    };
  }
}
