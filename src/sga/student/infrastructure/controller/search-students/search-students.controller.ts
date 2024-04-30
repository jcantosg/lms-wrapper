import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { GetStudentsResponse } from '#student/infrastructure/controller/get-students/get-students.response';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { SearchStudentsHandler } from '#student/application/search-students/search-students.handler';
import { SearchStudentsQuery } from '#student/application/search-students/search-students.query';
import { searchStudentsSchema } from '#student/infrastructure/config/validation-schema/search-students.schema';

interface SearchStudentQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('student')
export class SearchStudentsController {
  constructor(private readonly handler: SearchStudentsHandler) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestQueryParamValidationPipeService(searchStudentsSchema))
  async getStudents(
    @Query() params: SearchStudentQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetStudentsResponse>> {
    const query = new SearchStudentsQuery(
      params.text,
      request.user,
      params.page,
      params.limit,
      params.orderBy,
      params.orderType,
    );

    const response = await this.handler.handle(query);

    return GetStudentsResponse.create(
      response.items,
      params.page,
      params.limit,
      response.total,
    );
  }
}
