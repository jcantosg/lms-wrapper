import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import {
  IdentityDocument,
  IdentityDocumentType,
  IdentityDocumentValues,
} from '#/sga/shared/domain/value-object/identity-document';

export enum AdminUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

const DELETED_USER_NAME = 'deleted';
const DELETED_IDENTITY_DOCUMENT: IdentityDocumentValues = {
  identityDocumentType: IdentityDocumentType.DNI,
  identityDocumentNumber: '87296079Q',
};

export class AdminUser extends BaseEntity {
  static readonly passwordPattern = '^\\S{6,}$';

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _email: string,
    private _password: string,
    private _roles: AdminUserRoles[],
    private _name: string,
    private _avatar: string,
    private _businessUnits: BusinessUnit[],
    private _surname: string,
    private _surname2: string | null,
    private _identityDocument: IdentityDocument,
    private _status: AdminUserStatus,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    email: string,
    password: string,
    roles: AdminUserRoles[],
    name: string,
    avatar: string,
    businessUnits: BusinessUnit[],
    surname: string,
    surname2: string | null,
    identityDocument: IdentityDocument,
  ) {
    return new this(
      id,
      new Date(),
      new Date(),
      email,
      password,
      roles,
      name,
      avatar,
      businessUnits,
      surname,
      surname2,
      identityDocument,
      AdminUserStatus.ACTIVE,
    );
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get avatar(): string {
    return this._avatar;
  }

  public set avatar(value: string) {
    this._avatar = value;
  }

  public get roles(): AdminUserRoles[] {
    return this._roles;
  }

  public set roles(value: AdminUserRoles[]) {
    this._roles = value;
  }

  public grantRole(role: AdminUserRoles) {
    if (!this._roles.includes(role)) {
      this._roles.push(role);
    }
  }

  public removeRole(value: AdminUserRoles) {
    if (this._roles.includes(value)) {
      this._roles = this._roles.filter((role) => role !== value);
    }
  }

  public get businessUnits(): BusinessUnit[] {
    return this._businessUnits;
  }

  public set businessUnits(value: BusinessUnit[]) {
    this._businessUnits = value;
  }

  public addBusinessUnit(businessUnit: BusinessUnit) {
    if (!this._businessUnits.find((bu) => bu.id === businessUnit.id)) {
      this._businessUnits.push(businessUnit);
    }
    this.updatedAt = new Date();
  }

  public removeBusinessUnit(value: BusinessUnit) {
    if (this._businessUnits.find((bu) => bu.id === value.id)) {
      this._businessUnits = this._businessUnits.filter(
        (businessUnit) => businessUnit !== value,
      );
    }
    this.updatedAt = new Date();
  }

  public get status(): AdminUserStatus {
    return this._status;
  }

  public set status(value: AdminUserStatus) {
    this._status = value;
  }

  static getAdminUserStatuses(): string[] {
    return Object.values(AdminUserStatus);
  }

  public delete(): void {
    this.status = AdminUserStatus.DELETED;
    this.name = DELETED_USER_NAME;
    this.surname = DELETED_USER_NAME;
    this.surname2 = DELETED_USER_NAME;
    this.identityDocument = new IdentityDocument(DELETED_IDENTITY_DOCUMENT);
  }

  public get surname(): string {
    return this._surname;
  }

  public set surname(value: string) {
    this._surname = value;
  }

  public get surname2(): string | null {
    return this._surname2;
  }

  public set surname2(value: string) {
    this._surname2 = value;
  }

  public get identityDocument(): IdentityDocument {
    return this._identityDocument;
  }

  public set identityDocument(value: IdentityDocument) {
    this._identityDocument = value;
  }

  public update(
    name: string,
    surname: string,
    surname2: string | null,
    identityDocument: IdentityDocument,
    roles: AdminUserRoles[],
    avatar: string,
  ) {
    this._name = name;
    this._surname = surname;
    this._surname2 = surname2 ?? null;
    this._identityDocument = identityDocument;
    this._roles = roles;
    this._avatar = avatar;
    this.updatedAt = new Date();
  }
}
