import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetCommunicationsResponse } from '#shared/infrastructure/controller/communication/get-communications/get-communications.response';
import { SearchCommunicationsQuery } from '#shared/application/communication/search-communications/search-communications.query';
import { SearchCommunicationsHandler } from '#shared/application/communication/search-communications/search-communications.handler';
import { searchCommunicationsSchema } from '#shared/infrastructure/config/validation-schema/search-communications.schema';

interface SearchCommunicationsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('communication')
export class SearchCommunicationsController {
  constructor(private readonly handler: SearchCommunicationsHandler) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchCommunicationsSchema),
  )
  async getCommunications(
    @Query() queryParams: SearchCommunicationsQueryParams,
    @Request() req: AuthRequest,
  ) {
    const query = new SearchCommunicationsQuery(
      queryParams.text,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetCommunicationsResponse.create(
      response.items,
      query.page,
      query.limit,
      response.total,
    );
  }
}
