import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateLmsCourseHandler } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.handler';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { get360AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { createLmsCourseSchema } from '#/lms-wrapper/infrastructure/config/validation-schema/create-lms-course.schema';
import { CreateLmsCourseCommand } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.command';

interface CreateLmsCourseBody {
  name: string;
  shortName: string;
  categoryId: LmsCourseCategoryEnum;
}

@Controller('wrapper')
export class CreateLmsCourseController {
  constructor(private readonly handler: CreateLmsCourseHandler) {}

  @Post('lms-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...get360AdminUserRoles())
  @UsePipes(new JoiRequestBodyValidationPipe(createLmsCourseSchema))
  async createLmsCourse(@Body() body: CreateLmsCourseBody) {
    const command = new CreateLmsCourseCommand(
      body.name,
      body.shortName,
      body.categoryId,
    );
    await this.handler.handle(command);
  }
}
