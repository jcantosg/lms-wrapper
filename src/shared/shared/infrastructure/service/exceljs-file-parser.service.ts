import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';
import { File } from '#shared/domain/file-manager/file';
import { ExcelFileParser } from '#shared/domain/service/excel-file-parser.service';
import Joi, { ObjectSchema } from 'joi';
import { v4 as uuid } from 'uuid';
import * as Excel from 'exceljs';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { Country } from '#shared/domain/entity/country.entity';
import { ProvinceNotFoundException } from '#shared/domain/exception/country/province-not-found.exception';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
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

export class ExcelJSFileParser implements ExcelFileParser {
  constructor(
    private readonly crmImportRepository: CRMImportRepository,
    private readonly provincesGetter: ProvinceGetter,
    private readonly countryGetter: CountryGetter,
  ) {}

  async parse(file: File, validationSchema: ObjectSchema): Promise<CRMImport> {
    let importResult: CRMImport | null;
    importResult = await this.crmImportRepository.getByFileName(file.fileName);
    if (!importResult) {
      importResult = CRMImport.create(uuid(), null, null, null, file.fileName);
    }

    const wb = new Excel.Workbook();
    await wb.xlsx.load(file.content);
    const parsedObject = this.rowsToObject(wb);
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

      return importResult;
    }

    const importResultData: ImportData =
      this.parseValidationResult(validationResult);

    let country: Country;
    try {
      country = await this.countryGetter.getByName(importResultData.country);
    } catch (e) {
      importResult.update(
        CRMImportStatus.PARSE_ERROR,
        null,
        null,
        importResultData,
        CRMImportErrorMessage.COUNTRY_NOT_FOUND,
      );
      await this.crmImportRepository.save(importResult);

      return importResult;
    }

    try {
      const provinces = await this.provincesGetter.getProvinces(country);
      if (
        !provinces.find(
          (province) => province.value === importResultData.province,
        )
      ) {
        throw new ProvinceNotFoundException();
      }
    } catch (e) {
      importResult.update(
        CRMImportStatus.PARSE_ERROR,
        null,
        null,
        importResultData,
        CRMImportErrorMessage.PROVINCE_NOT_FOUND,
      );
      await this.crmImportRepository.save(importResult);

      return importResult;
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

      return importResult;
    }

    if (!getAllAcademicRecordModalities().includes(importResultData.modality)) {
      importResult.update(
        CRMImportStatus.PARSE_ERROR,
        null,
        null,
        importResultData,
        CRMImportErrorMessage.MODALITY_NOT_FOUND,
      );
      await this.crmImportRepository.save(importResult);

      return importResult;
    }

    importResult.update(
      CRMImportStatus.PARSED,
      importResultData.contactId,
      importResultData.leadId,
      importResultData,
      null,
    );
    await this.crmImportRepository.save(importResult);

    return importResult;
  }

  private parseValidationResult(
    validationResult: Joi.ValidationResult<any>,
  ): ImportData {
    return {
      name: validationResult.value.nombre,
      surname1: validationResult.value.apellido_1,
      surname2: validationResult.value.apellido_2,
      personalEmail: validationResult.value.email_personal,
      documentType: getIdentityDocumentType(validationResult.value.NIF),
      documentNumber: validationResult.value.NIF,
      universaeEmail: validationResult.value.email_universae,
      password: validationResult.value.password_alumno,
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

  private rowsToObject(wb: Excel.Workbook): any {
    const json: any = {};
    const keys: any[] = [];
    const values: any[] = [];

    wb.worksheets[0]
      .getRow(1)
      .eachCell({ includeEmpty: true }, (cell: Excel.Cell) =>
        keys.push(cell.value),
      );

    wb.worksheets[0]
      .getRow(2)
      .eachCell({ includeEmpty: true }, (cell: Excel.Cell) =>
        values.push(cell.value),
      );

    keys.forEach((key, index) => {
      if (key) {
        json[key] = values[index];
      }
    });

    return json;
  }
}
