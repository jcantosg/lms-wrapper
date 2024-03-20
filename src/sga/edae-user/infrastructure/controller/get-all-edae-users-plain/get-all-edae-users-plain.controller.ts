import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { GetAllEdaeUsersPlainQuery } from '#edae-user/application/get-all-edae-users-plain/get-all-edae-users-plain.query';
import { GetAllEdaeUsersPlainHandler } from '#edae-user/application/get-all-edae-users-plain/get-all-edae-users-plain.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getAllEdaeUsersPlainSchema } from '#edae-user/infrastructure/config/validation-schema/get-all-edae-users-plain.schema';
import { GetAllEdaeUsersPlainResponse } from '#edae-user/infrastructure/controller/get-all-edae-users-plain/get-all-edae-users-plain.response';

@Controller('edae-user/all')
export class GetAllEdaeUsersPlainController {
  constructor(private readonly handler: GetAllEdaeUsersPlainHandler) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllEdaeUsersPlainSchema),
  )
  async getAllEdaeUsers(
    @Query('businessUnit') businessUnitId: string,
    @Req() req: AuthRequest,
  ): Promise<any> {
    const query = new GetAllEdaeUsersPlainQuery(
      businessUnitId,
      req.user.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
    );

    return GetAllEdaeUsersPlainResponse.create(
      await this.handler.handle(query),
    );
  }
}
