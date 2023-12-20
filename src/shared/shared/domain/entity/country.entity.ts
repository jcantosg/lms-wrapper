import { BaseEntity } from '#shared/domain/entity/base.entity';

export class Country extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _iso: string,
    private _iso3: string,
    private _name: string,
    private _phoneCode: string,
    private _emoji: string,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    iso: string,
    iso3: string,
    name: string,
    phoneCode: string,
    emoji: string,
  ) {
    return new this(
      id,
      new Date(),
      new Date(),
      iso,
      iso3,
      name,
      phoneCode,
      emoji,
    );
  }

  public get iso(): string {
    return this._iso;
  }

  public set iso(value: string) {
    this._iso = value;
  }

  public get iso3(): string {
    return this._iso3;
  }

  public set iso3(value: string) {
    this._iso3 = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get phoneCode(): string {
    return this._phoneCode;
  }

  public set phoneCode(value: string) {
    this._phoneCode = value;
  }

  public get emoji(): string {
    return this._emoji;
  }

  public set emoji(value: string) {
    this._emoji = value;
  }
}
