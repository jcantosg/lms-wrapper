import { Student } from '#shared/domain/entity/student.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessFile } from '#student/domain/entity/administrative-process-file';
import { FileAlreadyExistsException } from '#shared/domain/exception/sga-student/file-already-exists.exception';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class AdministrativeProcess extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _type: AdministrativeProcessTypeEnum,
    private _status: AdministrativeProcessStatusEnum,
    private _files: AdministrativeProcessFile[],
    private _student: Student | null,
    private _academicRecord: AcademicRecord | null,
    private _businessUnit: BusinessUnit | null,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get type(): AdministrativeProcessTypeEnum {
    return this._type;
  }

  public set type(value: AdministrativeProcessTypeEnum) {
    this._type = value;
  }

  public get status(): AdministrativeProcessStatusEnum {
    return this._status;
  }

  public set status(value: AdministrativeProcessStatusEnum) {
    this._status = value;
  }

  public get student(): Student | null {
    return this._student;
  }

  public set student(value: Student) {
    this._student = value;
  }

  public get academicRecord(): AcademicRecord | null {
    return this._academicRecord;
  }

  public set academicRecord(value: AcademicRecord) {
    this._academicRecord = value;
  }

  public get files(): AdministrativeProcessFile[] {
    return this._files;
  }

  public set files(value: AdministrativeProcessFile[]) {
    this._files = value;
  }

  public get businessUnit(): BusinessUnit | null {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit | null) {
    this._businessUnit = value;
  }

  public addFile(file: AdministrativeProcessFile) {
    if (
      this._files.find((f) => f.value.documentType === file.value.documentType)
    ) {
      throw new FileAlreadyExistsException();
    } else {
      this._files.push(file);
    }
  }

  public removeFile(file: AdministrativeProcessFile) {
    this._files = this._files.filter(
      (f) => f.value.documentType !== file.value.documentType,
    );
  }

  public updateFile(file: AdministrativeProcessFile) {
    this.removeFile(file);
    this.addFile(file);
  }

  static create(
    id: string,
    type: AdministrativeProcessTypeEnum,
    student: Student | null,
    academicRecord: AcademicRecord | null,
    businessUnit: BusinessUnit | null,
  ): AdministrativeProcess {
    return new AdministrativeProcess(
      id,
      new Date(),
      new Date(),
      type,
      type === AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD
        ? AdministrativeProcessStatusEnum.PENDING_DOCUMENTS
        : AdministrativeProcessStatusEnum.PENDING_VALIDATION,
      [],
      student,
      academicRecord,
      businessUnit,
    );
  }
}
