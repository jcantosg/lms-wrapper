import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcessDocument } from '#student/domain/entity/administrative-process-document.entity';

export class AdministrativeProcess extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _type: AdministrativeProcessTypeEnum,
    private _status: AdministrativeProcessStatusEnum,
    private _photo: AdministrativeProcessDocument | null,
    private _identityDocuments: AdministrativeProcessDocument | null,
    private _accessDocuments: AdministrativeProcessDocument | null,
    private _academicRecord: AcademicRecord,
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

  public get academicRecord(): AcademicRecord | null {
    return this._academicRecord;
  }

  public set academicRecord(value: AcademicRecord) {
    this._academicRecord = value;
  }

  get createdBy(): AdminUser {
    return this._createdBy;
  }

  set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  get photo(): AdministrativeProcessDocument | null {
    return this._photo;
  }

  set photo(value: AdministrativeProcessDocument) {
    this._photo = value;
  }

  get identityDocuments(): AdministrativeProcessDocument | null {
    return this._identityDocuments;
  }

  set identityDocuments(value: AdministrativeProcessDocument) {
    this._identityDocuments = value;
  }

  get accessDocuments(): AdministrativeProcessDocument | null {
    return this._accessDocuments;
  }

  set accessDocuments(value: AdministrativeProcessDocument) {
    this._accessDocuments = value;
  }

  static create(
    id: string,
    type: AdministrativeProcessTypeEnum,
    academicRecord: AcademicRecord,
    user: AdminUser,
    identityDocuments: AdministrativeProcessDocument | null,
  ): AdministrativeProcess {
    return new AdministrativeProcess(
      id,
      new Date(),
      new Date(),
      user,
      user,
      type,
      AdministrativeProcessStatusEnum.PENDING_DOCUMENTS,
      null,
      identityDocuments,
      null,
      academicRecord,
    );
  }
}
