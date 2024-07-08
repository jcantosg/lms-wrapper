import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { get360AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetLmsCoursesHandler } from '#/lms-wrapper/application/lms-course/get-lms-courses/get-lms-courses.handler';
import { GetCoursesResponse } from '#/lms-wrapper/infrastructure/controller/get-courses/get-courses.response';

@Controller('wrapper')
export class GetCoursesController {
  constructor(private readonly handler: GetLmsCoursesHandler) {}

  @Get('lms-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...get360AdminUserRoles())
  async getCourses(): Promise<GetCoursesResponse> {
    const response = await this.handler.handle();

    return GetCoursesResponse.create(response);
  }
}
