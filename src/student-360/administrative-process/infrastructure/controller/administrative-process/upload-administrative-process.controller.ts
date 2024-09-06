import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { FilesInterceptor } from '@nestjs/platform-express';
import { File } from '#shared/domain/file-manager/file';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { uploadAdministrativeProcessSchema } from '#student-360/administrative-process/infrastructure/config/validation-schema/upload-administrative-process.schema';
import { UploadAdministrativeProcessCommand } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.command';
import { UploadAdministrativeProcessHandler } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.handler';

interface UploadAdministrativeProcessBody {
  academicRecordId: string | null | undefined;
  type: AdministrativeProcessTypeEnum;
}

@Controller('student-360')
export class UploadAdministrativeProcessController {
  constructor(private readonly handler: UploadAdministrativeProcessHandler) {}

  @Post('administrative-process')
  @UseGuards(StudentJwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new JoiRequestBodyValidationPipe(uploadAdministrativeProcessSchema))
  async trasnferAcademicRecord(
    @Body() body: UploadAdministrativeProcessBody,
    @Request() req: StudentAuthRequest,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '/(docx?)|(pdf)|(jpe?g)|(png)' }),
          new MaxFileSizeValidator({
            maxSize: 25000000,
            message: 'sga.academic-record.max-file-size-reached',
          }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ): Promise<void> {
    const uploadedFiles: File[] = [];
    if (files) {
      files.forEach((file) => {
        uploadedFiles.push(
          new File(
            'uploads/administrative-processes',
            `${file.originalname}`,
            file.buffer,
            file.mimetype,
          ),
        );
      });
    }

    const command = new UploadAdministrativeProcessCommand(
      !body.academicRecordId || body.academicRecordId === ''
        ? null
        : body.academicRecordId,
      body.type,
      uploadedFiles,
      req.user,
    );

    await this.handler.handle(command);
  }
}
