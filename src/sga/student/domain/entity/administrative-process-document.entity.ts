import { Student } from '#shared/domain/entity/student.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessDocumentsStatusEnum } from '#student/domain/enum/administrative-process-documents-status.enum';
import { AdministrativeProcessFile } from '#student/domain/entity/administrative-process-file';
import { FileAlreadyExistsException } from '#shared/domain/exception/sga-student/file-already-exists.exception';

export class AdministrativeProcessDocument extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _type: AdministrativeProcessTypeEnum,
    private _status: AdministrativeProcessDocumentsStatusEnum,
    private _files: AdministrativeProcessFile[],
    private _student: Student | null,
    private _academicRecord: AcademicRecord | null,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get type(): AdministrativeProcessTypeEnum {
    return this._type;
  }

  public set type(value: AdministrativeProcessTypeEnum) {
    this._type = value;
  }

  public get status(): AdministrativeProcessDocumentsStatusEnum {
    return this._status;
  }

  public set status(value: AdministrativeProcessDocumentsStatusEnum) {
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
  ): AdministrativeProcessDocument {
    return new AdministrativeProcessDocument(
      id,
      new Date(),
      new Date(),
      type,
      AdministrativeProcessDocumentsStatusEnum.PENDING_VALIDATION,
      [],
      student,
      academicRecord,
    );
  }
}
