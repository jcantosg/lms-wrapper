import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GetUrlSessionKeyHandler } from '#lms-wrapper/application/get-url-session-key/get-url-session-key.handler';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { GetUrlSessionKeyQuery } from '#lms-wrapper/application/get-url-session-key/get-url-session-key.query';
import { GetUrlWithSessionKeyResponse } from '#lms-wrapper/infrastructure/controller/get-url-with-session-key/get-url-with-session-key.response';

@Controller('wrapper')
export class GetUrlWithSessionKeyController {
  constructor(private readonly handler: GetUrlSessionKeyHandler) {}

  @Get('student/session-key')
  @UseGuards(StudentJwtAuthGuard)
  async getUrlWithSessionKey(
    @Request() req: StudentAuthRequest,
  ): Promise<GetUrlWithSessionKeyResponse> {
    const query = new GetUrlSessionKeyQuery(req.user);

    const response = await this.handler.handle(query);

    return GetUrlWithSessionKeyResponse.create(response);
  }
}
