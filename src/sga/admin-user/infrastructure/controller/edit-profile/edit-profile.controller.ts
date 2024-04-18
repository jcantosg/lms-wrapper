import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EditProfileHandler } from '#admin-user/application/edit-profile/edit-profile.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editProfileSchema } from '#admin-user/infrastructure/config/validation-schema/edit-profile.schema';
import { EditProfileCommand } from '#admin-user/application/edit-profile/edit-profile.command';

interface EditProfileBody {
  name: string;
  surname: string;
  surname2: string | null | undefined;
  avatar: string | null | undefined;
}

@Controller('profile')
export class EditProfileController {
  constructor(private readonly handler: EditProfileHandler) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(editProfileSchema))
  async editProfile(
    @Body() body: EditProfileBody,
    @Request() request: AuthRequest,
  ) {
    const command = new EditProfileCommand(
      request.user,
      body.name,
      body.surname,
      body.surname2,
      body.avatar,
    );
    await this.handler.handle(command);
  }
}
