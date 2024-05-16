import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetEnrollmentsByAcademicRecordHandler } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.handler';
import { GetEnrollmentsByAcademicRecordResponse } from '#student/infrastructure/controller/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetEnrollmentsByAcademicRecordQuery } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getEnrollmentsByAcademicRecordSchema } from '#student/infrastructure/config/validation-schema/get-enrollments-by-academic-record.schema';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

interface GetEnrollmentQueryParams {
  orderBy: string;
  orderType: OrderTypes;
}

@Controller('academic-record')
export class GetEnrollmentsByAcademicRecordController {
  constructor(
    private readonly handler: GetEnrollmentsByAcademicRecordHandler,
  ) {}

  @Get(':id/enrollment')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestQueryParamValidationPipeService(
      getEnrollmentsByAcademicRecordSchema,
    ),
  )
  async getEnrollmentsByAcademicRecord(
    @Query() queryParams: GetEnrollmentQueryParams,
    @Param('id') academicRecordId: string,
  ): Promise<GetEnrollmentsByAcademicRecordResponse> {
    const query = new GetEnrollmentsByAcademicRecordQuery(
      academicRecordId,
      queryParams.orderBy,
      queryParams.orderType,
    );
    const response = await this.handler.handle(query);

    return GetEnrollmentsByAcademicRecordResponse.create(response);
  }
}
