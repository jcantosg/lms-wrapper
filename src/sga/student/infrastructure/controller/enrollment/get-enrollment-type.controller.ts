import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetEnrollmentTypeHandler } from '#student/application/enrollment/get-enrollment-type/get-enrollment-type.handler';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';

@Controller('enrollment')
export class GetEnrollmentTypeController {
  constructor(private readonly handler: GetEnrollmentTypeHandler) {}

  @Get('type')
  @UseGuards(JwtAuthGuard)
  async getEnrollmentTypes(): Promise<EnrollmentTypeEnum[]> {
    return await this.handler.handle();
  }
}
