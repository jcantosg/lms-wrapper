import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import { File } from '#shared/domain/file-manager/file';
import { ExcelFileParser } from '#shared/domain/service/excel-file-parser.service';
import { CreateStudentFromCRMHandler } from '#student/application/create-student-from-crm/create-student-from-crm.handler';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { CreateStudentFromCRMCommand } from '#student/application/create-student-from-crm/create-student-from-crm.command';
import { zohoExcelImportSchema } from '#shared/infrastructure/config/validation-schema/zoho-excel-import.schema';
import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';
import { MailerService } from '@nestjs-modules/mailer';
import Mail from 'nodemailer/lib/mailer';

function filterFileType(fileNames: string[], fileType: string): string[] {
  return fileNames.filter((name) => {
    const parts = name.split('.');

    return parts[parts.length - 1] === fileType;
  });
}

async function readFiles(filesPath: string): Promise<File[]> {
  const files: File[] = [];
  const rawFileNames = filterFileType(fs.readdirSync(filesPath), 'xlsx');

  rawFileNames.forEach((fileName) => {
    const rawFile = fs.readFileSync(`${filesPath}/${fileName}`);
    files.push(new File(filesPath, fileName, rawFile));
  });

  return files;
}

function moveImportedFile(
  filesPath: string,
  fileName: string,
  subPath: string,
): void {
  fs.renameSync(
    `${filesPath}/${fileName}`,
    `${filesPath}/${subPath}/${fileName}`,
  );
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = await app.resolve(ConfigService);
  const mailer = await app.resolve(MailerService);
  const filesPath = configService.get('CRM_IMPORTS_PATH');
  const fileParser = app.get(ExcelFileParser);
  const handler = app.get(CreateStudentFromCRMHandler);
  const logger = new Logger('Import CRM leads');
  app.useLogger(logger);

  const importResponses: CRMImport[] = [];

  const files = await readFiles(filesPath);
  for (const file of files) {
    const parsedResponse = await fileParser.parse(file, zohoExcelImportSchema);
    if (parsedResponse.status !== CRMImportStatus.PARSED) {
      importResponses.push(parsedResponse);
    } else {
      importResponses.push(
        await handler.handle(new CreateStudentFromCRMCommand(parsedResponse)),
      );
    }
  }

  importResponses.forEach((response) => {
    if (
      [CRMImportStatus.PARSE_ERROR, CRMImportStatus.IMPORT_ERROR].includes(
        response.status,
      )
    ) {
      logger.log(
        `Error while importing file ${response.fileName}: ${response.errorMessage}`,
      );

      const failedFile = files.find(
        (file) => file.fileName === response.fileName,
      );
      const attachments: Mail.Attachment[] = [];

      if (failedFile) {
        attachments.push({
          filename: response.fileName,
          content: failedFile!.content.toString('base64'),
          contentTransferEncoding: 'base64',
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      }

      mailer.sendMail({
        to: [
          'jefatura@universae.com',
          'alvaro.lombardo@universae.com',
          'soporte360@universae.com ',
          'juan.ros@universae.com',
          'josel.cantos@universae.com',
        ],
        template: './import-failed',
        subject: 'Importación de alumno fallida',
        context: {
          fileName: response.fileName,
          errorMessage: response.errorMessage,
        },
        attachments,
      });
      moveImportedFile(filesPath, response.fileName, 'failed');
    } else {
      logger.log(`contact ${response.contactId} imported.`);
      moveImportedFile(filesPath, response.fileName, 'processed');
    }
  });

  await app.close();
}

bootstrap();
