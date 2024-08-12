import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StudentGender } from '#shared/domain/enum/student-gender.enum';
import { UpdateProfileHandler } from '#student-360/student/application/update-profile/update-profile.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { updateProfileSchema } from '#student-360/student/infrastructure/config/validation-schema/update-profile.schema';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { UpdateProfileCommand } from '#student-360/student/application/update-profile/update-profile.command';

interface UpdateProfileBody {
  name: string;
  surname: string;
  surname2: string;
  email: string;
  newPassword: string | null;
  avatar: string | null;
  birthDate: Date | null;
  gender: StudentGender;
  country: string | null;
  citizenship: string | null;
  socialSecurityNumber: string | null;
  phone: string | null;
  contactCountry: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  guardianName: string | null;
  guardianSurname: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
}

@Controller('student-360')
export class UpdateProfileController {
  constructor(private readonly handler: UpdateProfileHandler) {}

  @Put('profile')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(updateProfileSchema))
  async updateProfile(
    @Body() body: UpdateProfileBody,
    @Request() req: StudentAuthRequest,
  ) {
    const command = new UpdateProfileCommand(
      req.user.id,
      body.name,
      body.surname,
      body.surname2,
      body.email,
      body.newPassword,
      body.avatar,
      body.birthDate,
      body.gender,
      body.country,
      body.citizenship,
      body.socialSecurityNumber,
      body.phone,
      body.contactCountry,
      body.state,
      body.city,
      body.address,
      body.guardianName,
      body.guardianSurname,
      body.guardianEmail,
      body.guardianPhone,
    );

    await this.handler.handle(command);
  }
}
