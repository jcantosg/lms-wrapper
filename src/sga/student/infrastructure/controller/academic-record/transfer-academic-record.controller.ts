import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { FilesInterceptor } from '@nestjs/platform-express';
import { File } from '#shared/domain/file-manager/file';
import { TransferAcademicRecordHandler } from '#student/application/academic-record/transfer-academic-record/transfer-academic-record.handler';
import { TransferAcademicRecordCommand } from '#student/application/academic-record/transfer-academic-record/transfer-academic-record.command';
import { transferAcademicRecordSchema } from '#student/infrastructure/config/validation-schema/transfer-academic-record.schema';

interface TransferAcademicRecordBody {
  academicRecordId: string;
  businessUnitId: string;
  virtualCampusId: string;
  academicPeriodId: string;
  academicProgramId: string;
  modality: AcademicRecordModalityEnum;
  isModular: boolean;
  comments?: string;
}

@Controller('academic-record')
export class TransferAcademicRecordController {
  constructor(private readonly handler: TransferAcademicRecordHandler) {}

  @Put(':id/transfer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new JoiRequestBodyValidationPipe(transferAcademicRecordSchema))
  async trasnferAcademicRecord(
    @Param('id') oldAcademicRecordId: string,
    @Body() body: TransferAcademicRecordBody,
    @Request() req: AuthRequest,
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
            'uploads/academic-record-transfer',
            `${file.originalname}`,
            file.buffer,
            file.mimetype,
          ),
        );
      });
    }

    const command = new TransferAcademicRecordCommand(
      oldAcademicRecordId,
      body.academicRecordId,
      body.businessUnitId,
      body.virtualCampusId,
      body.academicPeriodId,
      body.academicProgramId,
      body.modality,
      body.isModular,
      body.comments ?? '',
      uploadedFiles,
      req.user,
    );

    await this.handler.handle(command);
  }
}
