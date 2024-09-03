import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { GetUrlWithSessionKeyResponse } from '#lms-wrapper/infrastructure/controller/get-url-with-session-key/get-url-with-session-key.response';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { GetEdaeUserUrlSessionKeyQuery } from '#lms-wrapper/application/lms-teacher/get-url-session-key/get-edae-user-url-session-key.query';
import { GetEdaeUserUrlSessionKeyHandler } from '#lms-wrapper/application/lms-teacher/get-url-session-key/get-edae-user-url-session-key.handler';

@Controller('wrapper')
export class GetEdaeUserUrlWithSessionKeyController {
  constructor(private readonly handler: GetEdaeUserUrlSessionKeyHandler) {}

  @Get('edae/session-key')
  @UseGuards(EdaeUserJwtAuthGuard)
  async getUrlWithSessionKey(
    @Request() req: EdaeUserAuthRequest,
  ): Promise<GetUrlWithSessionKeyResponse> {
    const query = new GetEdaeUserUrlSessionKeyQuery(req.user);

    const response = await this.handler.handle(query);

    return GetUrlWithSessionKeyResponse.create(response);
  }
}
