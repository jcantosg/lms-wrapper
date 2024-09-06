import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import { File } from '#shared/domain/file-manager/file';
import { CreateStudentFromCRMHandler } from '#student/application/create-student-from-crm/create-student-from-crm.handler';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { CreateStudentFromCRMCommand } from '#student/application/create-student-from-crm/create-student-from-crm.command';
import { zohoExcelImportSchema } from '#shared/infrastructure/config/validation-schema/zoho-excel-import.schema';
import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';
import {
  CRMImportBatch,
  ExcelFileParserBatch,
} from '#shared/domain/service/excel-file-parser-batch.service';

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

function moveImportedFile(filesPath: string, fileName: string): void {
  fs.renameSync(
    `${filesPath}/${fileName}`,
    `${filesPath}/processed-batch/${fileName}`,
  );
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = await app.resolve(ConfigService);
  const filesPath = `${configService.get('CRM_IMPORTS_PATH')}/batch`;
  const fileParser = app.get(ExcelFileParserBatch);
  const handler = app.get(CreateStudentFromCRMHandler);
  const logger = new Logger('Import CRM leads');
  app.useLogger(logger);

  const files = await readFiles(filesPath);

  for (const file of files) {
    let fileParserResponse: CRMImportBatch = {
      imports: [],
      offset: 2,
      limit: 50,
      total: 0,
    };
    let hasErrors = false;

    do {
      logger.log(
        `Importando de la linea ${fileParserResponse.offset} a la línea ${
          fileParserResponse.limit + fileParserResponse.offset
        }...`,
      );

      fileParserResponse = await fileParser.parse(
        file,
        zohoExcelImportSchema,
        fileParserResponse.offset,
        fileParserResponse.limit,
      );
      const importResponses: CRMImport[] = [];
      const parseResponses = fileParserResponse.imports;
      fileParserResponse.imports = [];

      const failedRows = parseResponses.filter(
        (row) => row.status === CRMImportStatus.PARSE_ERROR,
      );
      const parsedRows = parseResponses.filter(
        (row) => row.status === CRMImportStatus.PARSED,
      );

      if (failedRows.length > 0) {
        logger.log(`${failedRows.length} rows failed:`);
        failedRows.forEach((row) => {
          logger.log(
            `Row ${row.id} contactId: ${row.contactId} failed. Reason: ${row.errorMessage}`,
          );
        });
        hasErrors = true;
      }

      for (const row of parsedRows) {
        importResponses.push(
          await handler.handle(new CreateStudentFromCRMCommand(row)),
        );
      }

      importResponses.forEach((response) => {
        if (response.status === CRMImportStatus.IMPORT_ERROR) {
          logger.log(
            `Error while importing row ${response.id} contactId: ${response.contactId}. Reason: ${response.errorMessage}`,
          );
          hasErrors = true;
        } else {
          logger.log(`contact ${response.contactId} imported.`);
        }
      });
    } while (fileParserResponse.offset < fileParserResponse.total);

    if (!hasErrors) {
      moveImportedFile(filesPath, file.fileName);
    }
  }

  await app.close();
}

bootstrap();
