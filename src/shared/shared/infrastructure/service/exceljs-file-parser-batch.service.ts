import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';
import { File } from '#shared/domain/file-manager/file';
import Joi, { ObjectSchema } from 'joi';
import * as Excel from 'exceljs';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import {
  StudentGender,
  getAllStudentGenders,
} from '#shared/domain/enum/student-gender.enum';
import { CRMImportErrorMessage } from '#shared/domain/enum/crm-import-error-message.enum';
import {
  AcademicRecordModalityEnum,
  getAllAcademicRecordModalities,
} from '#student/domain/enum/academic-record-modality.enum';
import {
  IdentityDocumentType,
  getIdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import {
  CRMImportBatch,
  ExcelFileParserBatch,
} from '#shared/domain/service/excel-file-parser-batch.service';

export interface ImportData {
  name: string;
  surname1: string;
  surname2: string;
  personalEmail: string;
  documentType: IdentityDocumentType | null;
  documentNumber: string | null;
  universaeEmail: string;
  password: string;
  phone: string | null;
  province: string | null;
  city: string | null;
  country: string | null;
  cp: string | null;
  gender: StudentGender | null;
  birthDate: Date;
  nuss: string | null;
  defense: boolean;
  contactId: string;
  businessUnitName: string;
  virtualCampusCode: string;
  academicProgramCode: string;
  academicPeriodCode: string;
  modality: AcademicRecordModalityEnum;
  leadId: string;
}

const PREFIX_PASSWORD = 'universae@';

export class ExcelJSFileParserBatch implements ExcelFileParserBatch {
  constructor(
    private readonly crmImportRepository: CRMImportRepository,
    private readonly countryGetter: CountryGetter,
  ) {}

  async parse(
    file: File,
    validationSchema: ObjectSchema,
    offset: number,
    limit: number,
  ): Promise<CRMImportBatch> {
    const importResults: CRMImportBatch = {
      imports: [],
      offset,
      limit,
      total: 0,
    };

    const wb = new Excel.Workbook();
    await wb.xlsx.load(file.content);
    const parsedArray = this.rowsToObject(wb, offset, limit);

    importResults.total = this.getTotalRowCount(wb);
    importResults.offset = importResults.offset + importResults.limit + 1;
    for (const parsedObject of parsedArray) {
      let importResult: CRMImport | null;
      importResult = await this.crmImportRepository.get(
        `${file.fileName}-${parsedObject.row_number}`,
      );
      if (!importResult) {
        importResult = CRMImport.create(
          `${file.fileName}-${parsedObject.row_number}`,
          null,
          null,
          null,
          `${file.fileName}-${parsedObject.row_number}`,
        );
      }

      delete parsedObject.row_number;

      const validationResult = validationSchema.validate(parsedObject);

      if (validationResult.error) {
        importResult.update(
          CRMImportStatus.PARSE_ERROR,
          null,
          null,
          null,
          validationResult.error.details[0].message,
        );
        await this.crmImportRepository.save(importResult);

        importResults.imports.push(importResult);
        continue;
      }

      const importResultData: ImportData =
        this.parseValidationResult(validationResult);

      try {
        await this.countryGetter.getByName(importResultData.country);
      } catch (e) {
        importResult.update(
          CRMImportStatus.PARSE_ERROR,
          null,
          null,
          importResultData,
          CRMImportErrorMessage.COUNTRY_NOT_FOUND,
        );
        await this.crmImportRepository.save(importResult);

        importResults.imports.push(importResult);
        continue;
      }

      if (
        importResultData.gender !== null &&
        !getAllStudentGenders().includes(importResultData.gender)
      ) {
        importResult.update(
          CRMImportStatus.PARSE_ERROR,
          null,
          null,
          importResultData,
          CRMImportErrorMessage.GENDER_NOT_FOUND,
        );
        await this.crmImportRepository.save(importResult);

        importResults.imports.push(importResult);
        continue;
      }

      if (
        !getAllAcademicRecordModalities().includes(importResultData.modality)
      ) {
        importResult.update(
          CRMImportStatus.PARSE_ERROR,
          null,
          null,
          importResultData,
          CRMImportErrorMessage.MODALITY_NOT_FOUND,
        );
        await this.crmImportRepository.save(importResult);

        importResults.imports.push(importResult);
        continue;
      }

      importResult.update(
        CRMImportStatus.PARSED,
        importResultData.contactId,
        importResultData.leadId,
        importResultData,
        null,
      );
      await this.crmImportRepository.save(importResult);

      importResults.imports.push(importResult);
    }

    return importResults;
  }

  private parseValidationResult(
    validationResult: Joi.ValidationResult<any>,
  ): ImportData {
    return {
      name: validationResult.value.nombre,
      surname1: validationResult.value.apellido_1,
      surname2: validationResult.value.apellido_2 ?? '',
      personalEmail: validationResult.value.email_personal,
      documentType: getIdentityDocumentType(validationResult.value.NIF),
      documentNumber: validationResult.value.NIF,
      universaeEmail: validationResult.value.email_universae,
      password: `${PREFIX_PASSWORD}${validationResult.value.NIF}`,
      phone: validationResult.value.Telefono,
      province: validationResult.value.provincia,
      city: validationResult.value.municipio,
      country: validationResult.value.country,
      cp: validationResult.value.cp,
      gender: this.parseGender(validationResult.value.sexo),
      birthDate: validationResult.value.birth_date,
      nuss: validationResult.value.nuss,
      defense: validationResult.value.defensa,
      contactId: validationResult.value.contact_id,
      businessUnitName: validationResult.value.unidad_negocio,
      virtualCampusCode: validationResult.value.sede_virtual,
      academicProgramCode: validationResult.value.programa_formativo,
      academicPeriodCode: validationResult.value.periodo,
      modality: this.parseModality(validationResult.value.modalidad),
      leadId: validationResult.value.n_oportunidad,
    };
  }

  private parseGender(sexo: any): StudentGender {
    switch (sexo) {
      case 'H':
        return StudentGender.MALE;
      case 'M':
        return StudentGender.FEMALE;
      default:
        return StudentGender.OTHER;
    }
  }

  private parseModality(modality: any): AcademicRecordModalityEnum {
    switch (modality) {
      case 'Distancia':
        return AcademicRecordModalityEnum.ELEARNING;
      case 'Presencial':
        return AcademicRecordModalityEnum.PRESENCIAL;
      case 'Semipresencial':
        return AcademicRecordModalityEnum.MIXED;
      default:
        return AcademicRecordModalityEnum.ELEARNING;
    }
  }

  private getTotalRowCount(wb: Excel.Workbook): number {
    return wb.worksheets[0].actualRowCount;
  }

  private rowsToObject(wb: Excel.Workbook, offset: number, limit: number): any {
    const array: any[] = [];

    const keys: any[] = [];

    wb.worksheets[0]
      .getRow(1)
      .eachCell({ includeEmpty: true }, (cell: Excel.Cell) =>
        keys.push(cell.value),
      );

    const rowCount = this.getTotalRowCount(wb);
    const rowLimit = offset + limit < rowCount ? offset + limit : rowCount;

    for (let i = offset; i <= rowLimit; i++) {
      const json: any = {};
      const values: any[] = [];

      json['row_number'] = i;

      wb.worksheets[0]
        .getRow(i)
        .eachCell({ includeEmpty: true }, (cell: Excel.Cell) =>
          values.push(cell.value),
        );

      keys.forEach((key, index) => {
        if (key) {
          json[key] = values[index];
        }
      });

      array.push(json);
    }

    return array;
  }
}
