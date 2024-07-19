import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { StudentGender } from '#shared/domain/enum/student-gender.enum';
import { AccessQualification } from '#shared/domain/enum/access-qualification.enum';
import { EditStudentHandler } from '#student/application/edit-student/edit-student.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditStudentCommand } from '#student/application/edit-student/edit-student.command';
import { editStudentSchema } from '#student/infrastructure/config/validation-schema/edit-student.schema';

interface EditStudentBody {
  name: string;
  surname: string;
  surname2: string;
  email: string;
  universaeEmail: string;
  isActive: boolean;
  avatar: string | null;
  birthDate: Date | null;
  gender: StudentGender | null;
  country: string | null;
  citizenship: string | null;
  identityDocument: IdentityDocumentValues | null;
  socialSecurityNumber: string | null;
  accessQualification: AccessQualification | null;
  niaIdalu: string | null;
  phone: string | null;
  contactCountry: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  guardianName: string | null;
  guardianSurname: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
  status: boolean;
  isDefense: boolean;
}

@Controller('student')
export class EditStudentController {
  constructor(private readonly handler: EditStudentHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestBodyValidationPipe(editStudentSchema),
    new JoiRequestParamIdValidationPipeService(uuidSchema),
  )
  async editStudent(
    @Body() body: EditStudentBody,
    @Param('id') id: string,
    @Request() request: AuthRequest,
  ) {
    const command = new EditStudentCommand(
      id,
      body.name,
      body.surname,
      body.surname2,
      body.email,
      body.universaeEmail,
      body.isActive,
      request.user,
      body.avatar,
      body.birthDate,
      body.gender,
      body.country,
      body.citizenship,
      body.identityDocument,
      body.socialSecurityNumber,
      body.accessQualification,
      body.niaIdalu,
      body.phone,
      body.contactCountry,
      body.state,
      body.city,
      body.address,
      body.guardianName,
      body.guardianSurname,
      body.guardianEmail,
      body.guardianPhone,
      body.isDefense,
    );

    await this.handler.handle(command);
  }
}
