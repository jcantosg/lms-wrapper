import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UploadSubjectResourceHandler } from '#academic-offering/applicaton/upload-subject-resource/upload-subject-resource.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uploadSubjectResourceSchema } from '#academic-offering/infrastructure/config/validation-schema/upload-subject-resource.schema';
import { File } from '#shared/domain/file-manager/file';
import { UploadSubjectResourceCommand } from '#academic-offering/applicaton/upload-subject-resource/upload-subject-resource.command';

interface UploadSubjectResourceBody {
  id: string;
}

@Controller('subject')
export class UploadSubjectResourceController {
  constructor(private readonly handler: UploadSubjectResourceHandler) {}

  @Post(':id/resource')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new JoiRequestBodyValidationPipe(uploadSubjectResourceSchema))
  async uploadSubjectResource(
    @Body() body: UploadSubjectResourceBody,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: AuthRequest,
  ) {
    const uploadedFiles = files.map((file: Express.Multer.File): File => {
      return new File(
        'uploads/subject-resources',
        `${body.id}-${file.originalname}`,
        file.buffer,
        file.mimetype,
      );
    });
    const command = new UploadSubjectResourceCommand(
      body.id,
      id,
      uploadedFiles,
      req.user,
    );

    await this.handler.handle(command);
  }
}
