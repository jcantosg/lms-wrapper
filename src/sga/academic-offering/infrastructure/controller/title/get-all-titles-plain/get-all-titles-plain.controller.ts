import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import {
  GetAllTitlesPlainResponse,
  TitleResponseBasic,
} from '#academic-offering/infrastructure/controller/title/get-all-titles-plain/get-all-titles-plain.response';
import { GetAllTitlesPlainHandler } from '#academic-offering/applicaton/title/get-all-titles-plain/get-all-titles-plain.handler';
import { GetAllTitlesPlainQuery } from '#academic-offering/applicaton/title/get-all-titles-plain/get-all-titles-plain.query';

@Controller('title')
export class GetAllTitlesPlainController {
  constructor(private readonly handler: GetAllTitlesPlainHandler) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllTitlesPlain(
    @Query('businessUnit') businessUnitId: string,
    @Req() req: AuthRequest,
  ): Promise<TitleResponseBasic[]> {
    const query = new GetAllTitlesPlainQuery(
      businessUnitId,
      req.user.businessUnits.map((bu) => bu.id),
    );
    const response = await this.handler.handle(query);

    return GetAllTitlesPlainResponse.create(response);
  }
}
