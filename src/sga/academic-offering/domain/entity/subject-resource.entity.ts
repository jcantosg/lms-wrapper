import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class SubjectResource extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _url: string,
    private _size: number,
    private _subject: Subject,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get url(): string {
    return this._url;
  }

  public set url(value: string) {
    this._url = value;
  }

  public get size(): number {
    return this._size;
  }

  public set size(value: number) {
    this._size = value;
  }

  public get subject(): Subject {
    return this._subject;
  }

  public set subject(value: Subject) {
    this._subject = value;
  }

  public get createdBy(): AdminUser {
    return this._createdBy;
  }

  public set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  public get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  public set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  static create(
    id: string,
    name: string,
    url: string,
    size: number,
    subject: Subject,
    user: AdminUser,
  ): SubjectResource {
    return new SubjectResource(
      id,
      name,
      url,
      size,
      subject,
      new Date(),
      new Date(),
      user,
      user,
    );
  }
}
