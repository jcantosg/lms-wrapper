import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export class EdaeUser extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _name: string,
    private _surname1: string,
    private _surname2: string | null,
    private _email: string,
    private _identityDocument: IdentityDocument,
    private _roles: EdaeRoles[],
    private _businessUnits: BusinessUnit[],
    private _timeZone: TimeZoneEnum,
    private _isRemote: boolean,
    private _location: Country,
    private _avatar: string | null,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get surname1(): string {
    return this._surname1;
  }
  public set surname1(value: string) {
    if (!value) throw new Error('Surname1 cannot be empty.');
    this._surname1 = value;
  }

  public get surname2(): string | null {
    return this._surname2;
  }
  public set surname2(value: string | null) {
    this._surname2 = value;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get identityDocument(): IdentityDocument {
    return this._identityDocument;
  }
  public set identityDocument(value: IdentityDocument) {
    this._identityDocument = value;
  }

  public get roles(): EdaeRoles[] {
    return this._roles;
  }
  public set roles(value: EdaeRoles[]) {
    this._roles = value;
  }

  public get businessUnits(): BusinessUnit[] {
    return this._businessUnits;
  }
  public set businessUnits(value: BusinessUnit[]) {
    this._businessUnits = value;
  }

  public get timeZone(): TimeZoneEnum {
    return this._timeZone;
  }
  public set timeZone(value: TimeZoneEnum) {
    this._timeZone = value;
  }

  public get isRemote(): boolean {
    return this._isRemote;
  }
  public set isRemote(value: boolean) {
    this._isRemote = value;
  }

  public get location(): Country {
    return this._location;
  }
  public set location(value: Country) {
    this._location = value;
  }

  public get avatar(): string | null {
    return this._avatar;
  }
  public set avatar(value: string | null) {
    this._avatar = value;
  }

  static create(
    id: string,
    name: string,
    surname1: string,
    surname2: string | null,
    email: string,
    identityDocument: IdentityDocument,
    roles: EdaeRoles[],
    businessUnits: BusinessUnit[],
    timeZone: TimeZoneEnum,
    isRemote: boolean,
    location: Country,
    avatar: string | null,
  ): EdaeUser {
    return new this(
      id,
      new Date(),
      new Date(),
      name,
      surname1,
      surname2,
      email,
      identityDocument,
      roles,
      businessUnits,
      timeZone,
      isRemote,
      location,
      avatar,
    );
  }

  public removeBusinessUnit(businessUnit: BusinessUnit): void {
    this._businessUnits = this._businessUnits.filter(
      (bu) => bu.id !== businessUnit.id,
    );
  }

  public addBusinessUnit(businessUnit: BusinessUnit): void {
    if (!this._businessUnits.find((bu) => bu.id === businessUnit.id)) {
      this._businessUnits.push(businessUnit);
      this.updatedAt = new Date();
    }
  }
}
