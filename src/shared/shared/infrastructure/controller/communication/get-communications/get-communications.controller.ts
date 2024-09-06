import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { GetCommunicationsHandler } from '#shared/application/communication/get-communications/get-communications.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getCommunicationsSchema } from '#shared/infrastructure/config/validation-schema/get-communications.schema';
import { GetCommunicationsQuery } from '#shared/application/communication/get-communications/get-communications.query';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetCommunicationsResponse } from '#shared/infrastructure/controller/communication/get-communications/get-communications.response';

interface GetCommunicationsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  subject: string | null;
  sentBy: string | null;
  businessUnit: string | null;
  createdAt: Date | null;
  sentAt: Date | null;
  communicationStatus: CommunicationStatus | null;
}

@Controller('communication')
export class GetCommunicationsController {
  constructor(private readonly handler: GetCommunicationsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getCommunicationsSchema),
  )
  async getCommunications(
    @Query() queryParams: GetCommunicationsQueryParams,
    @Request() req: AuthRequest,
  ) {
    const query = new GetCommunicationsQuery(
      req.user,
      queryParams.subject,
      queryParams.sentBy,
      queryParams.businessUnit,
      queryParams.createdAt,
      queryParams.sentAt,
      queryParams.communicationStatus,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.page,
      queryParams.limit,
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
