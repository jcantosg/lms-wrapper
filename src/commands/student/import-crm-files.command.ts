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
    const rawFile = fs.readFileSync(`${filesPath}${fileName}`);
    files.push(new File(filesPath, fileName, rawFile));
  });

  return files;
}

function moveImportedFile(filesPath: string, fileName: string): void {
  fs.renameSync(`${filesPath}${fileName}`, `${filesPath}processed/${fileName}`);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = await app.resolve(ConfigService);
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
    } else {
      logger.log(`contact ${response.contactId} imported.`);
      moveImportedFile(filesPath, response.fileName);
    }
  });

  await app.close();
}

bootstrap();
