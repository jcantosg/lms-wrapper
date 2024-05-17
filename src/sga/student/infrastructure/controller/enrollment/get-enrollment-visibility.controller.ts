import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetEnrollmentVisibilityHandler } from '#student/application/enrollment/get-enrollment-visibility/get-enrollment-visibility.handler';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';

@Controller('enrollment')
export class GetEnrollmentVisibilityController {
  constructor(private readonly handler: GetEnrollmentVisibilityHandler) {}

  @Get('visibility')
  @UseGuards(JwtAuthGuard)
  async getEnrollmentVisibility(): Promise<EnrollmentVisibilityEnum[]> {
    return await this.handler.handle();
  }
}
