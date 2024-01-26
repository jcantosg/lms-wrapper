import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';

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
  }

  public removeBusinessUnit(value: BusinessUnit) {
    if (this._businessUnits.find((bu) => bu.id === value.id)) {
      this._businessUnits = this._businessUnits.filter(
        (businessUnit) => businessUnit !== value,
      );
    }
  }
}
