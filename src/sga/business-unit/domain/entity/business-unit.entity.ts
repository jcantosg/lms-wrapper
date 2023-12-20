import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Country } from '#shared/domain/entity/country.entity';

export class BusinessUnit extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _name: string,
    private _code: string,
    private _isActive: boolean,
    private _country: Country,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    name: string,
    code: string,
    country: Country,
    user: AdminUser,
  ) {
    return new this(
      id,
      new Date(),
      new Date(),
      name,
      code,
      true,
      country,
      user,
      user,
    );
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get code(): string {
    return this._code;
  }

  public set code(value: string) {
    this._code = value;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
  }

  public get country(): Country {
    return this._country;
  }

  public set country(value: Country) {
    this._country = value;
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
}
