import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import {
  GetInternalGroupStudentResponse,
  GetInternalGroupStudentsResponse,
} from '#student/infrastructure/controller/internal-group/get-internal-group-students/get-internal-group-students.response';
import { getInternalGroupStudentsSchema } from '#student/infrastructure/config/validation-schema/get-internal-group-students.schema';
import { GetInternalGroupStudentsQuery } from '#student/application/get-internal-group-students/get-internal-group-students.query';
import { GetInternalGroupStudentsHandler } from '#student/application/get-internal-group-students/get-internal-group-students.handler';

interface GetInternalGroupStudentsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string | null;
}

@Controller('internal-group')
export class GetInternalGroupStudentsController {
  constructor(private readonly handler: GetInternalGroupStudentsHandler) {}

  @Get(':id/students')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getInternalGroupStudentsSchema,
    ),
  )
  async getInternalGroupStudents(
    @Param('id') internalGroupId: string,
    @Query() params: GetInternalGroupStudentsQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetInternalGroupStudentResponse>> {
    const query = new GetInternalGroupStudentsQuery(
      internalGroupId,
      params.text,
      request.user,
      params.page,
      params.limit,
      params.orderBy,
      params.orderType,
    );

    const response = await this.handler.handle(query);

    return GetInternalGroupStudentsResponse.create(
      response.items,
      params.page,
      params.limit,
      response.total,
    );
  }
}
