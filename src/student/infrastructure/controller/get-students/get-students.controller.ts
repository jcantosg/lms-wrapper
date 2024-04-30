import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetStudentsHandler } from '#/student/application/get-students/get-students.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { getStudentsSchema } from '#/student/infrastructure/config/validation-schema/get-students.schema';
import { GetStudentsQuery } from '#/student/application/get-students/get-students.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { GetStudentsResponse } from '#/student/infrastructure/controller/get-students/get-students.response';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';

interface GetStudentQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name: string | null;
  surname: string | null;
  identityDocumentNumber: string | null;
  businessUnit: string | null;
  academicProgram: string | null;
}

@Controller('student')
export class GetStudentsController {
  constructor(private readonly handler: GetStudentsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestQueryParamValidationPipeService(getStudentsSchema))
  async getStudents(
    @Query() params: GetStudentQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetStudentsResponse>> {
    const query = new GetStudentsQuery(
      params.name,
      params.surname,
      params.identityDocumentNumber,
      params.businessUnit,
      params.academicProgram,
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
