import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { GetProvincesHandler } from '#shared/application/get-provinces/get-provinces.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetProvincesQuery } from '#shared/application/get-provinces/get-provinces.query';
import { GetProvincesResponse } from '#shared/infrastructure/controller/province/get-provinces.response';

@Controller('country')
export class GetProvincesController {
  constructor(private readonly handler: GetProvincesHandler) {}

  @Get(':id/province')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getProvinces(@Param('id') countryId: string) {
    const query = new GetProvincesQuery(countryId);

    const response = await this.handler.handle(query);

    return GetProvincesResponse.create(response);
  }
}
