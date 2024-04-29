import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BusinessUnitResponseBasic } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-business-unit.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAllBusinessUnitsPlainHandler } from '#business-unit/application/business-unit/get-all-business-units-plain/get-all-business-units-plain.handler';
import { GetAllBusinessUnitPlainResponse } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units-plain/get-all-business-units-plain.response';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAllBusinessUnitsPlainQuery } from '#business-unit/application/business-unit/get-all-business-units-plain/get-all-business-units-plain.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getAllBusinessUnitPlainSchema } from '#business-unit/infrastructure/config/schema/get-all-business-unit-plain.schema';

type GetAllBusinessUnitPlainParam = {
  hasAcademicPeriods: boolean;
};

@Controller('business-unit')
export class GetAllBusinessPlainController {
  constructor(private readonly handler: GetAllBusinessUnitsPlainHandler) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAllBusinessUnitPlainSchema,
    ),
  )
  async getAllBusinessUnitsPlain(
    @Query() queryParams: GetAllBusinessUnitPlainParam,
    @Req() req: AuthRequest,
  ): Promise<BusinessUnitResponseBasic[]> {
    const query = new GetAllBusinessUnitsPlainQuery(
      req.user.businessUnits.map((bu) => bu.id),
      queryParams.hasAcademicPeriods,
    );
    const response = await this.handler.handle(query);

    return GetAllBusinessUnitPlainResponse.create(response);
  }
}
