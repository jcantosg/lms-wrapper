import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateStudentHandler } from '#/student/application/create-student/create-student.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { createStudentSchema } from '#/student/infrastructure/config/validation-schema/create-student.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CreateStudentCommand } from '#/student/application/create-student/create-student.command';

interface CreateStudentBody {
  id: string;
  name: string;
  surname: string;
  surname2: string;
  email: string;
  universaeEmail: string;
}

@Controller('student')
export class CreateStudentController {
  constructor(private readonly handler: CreateStudentHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(createStudentSchema))
  async createStudent(
    @Body() body: CreateStudentBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new CreateStudentCommand(
      body.id,
      body.name,
      body.surname,
      body.surname2,
      body.email,
      body.universaeEmail,
      request.user,
    );
    await this.handler.handle(command);
  }
}
