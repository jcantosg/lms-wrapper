import {
  Body,
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UploadSubjectResourceHandler } from '#academic-offering/applicaton/subject/upload-subject-resource/upload-subject-resource.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { File } from '#shared/domain/file-manager/file';
import {
  ResourceFile,
  UploadSubjectResourceCommand,
} from '#academic-offering/applicaton/subject/upload-subject-resource/upload-subject-resource.command';
import { SubjectIdsFilesWrongLengthException } from '#shared/domain/exception/academic-offering/subject-ids-files-wrong-length.exception';
import { uploadSubjectResourceSchema } from '#academic-offering/infrastructure/config/validation-schema/upload-subject-resource.schema';

interface UploadSubjectResourceBody {
  ids: string[];
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
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '/(docx?)|(pdf)|(jpe?g)|(png)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Request() req: AuthRequest,
  ) {
    if (body.ids.length !== files.length) {
      throw new SubjectIdsFilesWrongLengthException();
    }
    const uploadedFiles: ResourceFile[] = [];
    files.forEach((file, index) => {
      uploadedFiles.push({
        id: body.ids[index],
        file: new File(
          'uploads/subject-resources',
          `${file.originalname}`,
          file.buffer,
          file.mimetype,
        ),
      });
    });
    const command = new UploadSubjectResourceCommand(
      uploadedFiles,
      id,
      req.user,
    );

    await this.handler.handle(command);
  }
}
