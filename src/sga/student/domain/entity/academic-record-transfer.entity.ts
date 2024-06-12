import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export class AcademicRecordTransfer extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _oldAcademicRecord: AcademicRecord,
    private _newAcademicRecord: AcademicRecord,
    private _comments?: string,
    private _files?: string[],
  ) {
    super(id, createdAt, updatedAt);
  }

  public get createdBy(): AdminUser {
    return this._createdBy;
  }

  public set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  public get oldAcademicRecord(): AcademicRecord {
    return this._oldAcademicRecord;
  }

  public set oldAcademicRecord(value: AcademicRecord) {
    this._oldAcademicRecord = value;
  }

  public get newAcademicRecord(): AcademicRecord {
    return this._newAcademicRecord;
  }

  public set newAcademicRecord(value: AcademicRecord) {
    this._newAcademicRecord = value;
  }

  public get comments(): string | undefined {
    return this._comments;
  }

  public set comments(value: string) {
    this._comments = value;
  }

  public get files(): string[] | undefined {
    return this._files;
  }

  public set files(value: string[]) {
    this._files = value;
  }

  public get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  public set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  static create(
    id: string,
    user: AdminUser,
    oldAcademicRecord: AcademicRecord,
    newAcademicRecord: AcademicRecord,
    comments?: string,
    files?: string[],
  ): AcademicRecordTransfer {
    const now = new Date();

    return new AcademicRecordTransfer(
      id,
      now,
      now,
      user,
      user,
      oldAcademicRecord,
      newAcademicRecord,
      comments,
      files,
    );
  }
}
