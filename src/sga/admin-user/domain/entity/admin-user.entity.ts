import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
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
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    email: string,
    password: string,
    roles: AdminUserRoles[],
  ) {
    return new this(id, new Date(), new Date(), email, password, roles);
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
}
