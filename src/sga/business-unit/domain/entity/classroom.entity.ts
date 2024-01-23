import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ClassroomWrongCapacityException } from '#shared/domain/exception/business-unit/classroom-wrong-capacity.exception';

const MINIMUM_CAPACITY = 1;

export class Classroom extends BaseEntity {
  private constructor(
    id: string,
    private _code: string,
    private _name: string,
    private _capacity: number,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _isActive: boolean,
    private _examinationCenter: ExaminationCenter,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get code(): string {
    return this._code;
  }

  public set code(value: string) {
    this._code = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get capacity(): number {
    return this._capacity;
  }

  public set capacity(value: number) {
    this._capacity = value;
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

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
  }

  public get examinationCenter(): ExaminationCenter {
    return this._examinationCenter;
  }

  public set examinationCenter(value: ExaminationCenter) {
    this._examinationCenter = value;
  }

  public static create(
    id: string,
    code: string,
    name: string,
    capacity: number,
    user: AdminUser,
    examinationCenter: ExaminationCenter,
  ): Classroom {
    if (capacity < MINIMUM_CAPACITY) {
      throw new ClassroomWrongCapacityException();
    }

    return new Classroom(
      id,
      code,
      name,
      capacity,
      new Date(),
      new Date(),
      user,
      user,
      true,
      examinationCenter,
    );
  }
}
