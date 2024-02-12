import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterMainException } from '#shared/domain/exception/business-unit/examination-center-main.exception';
import { ExaminationCenterAlreadyAddedException } from '#shared/domain/exception/business-unit/examination-center-already-added.exception';

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
    private _virtualCampuses: VirtualCampus[],
    private _examinationCenters: ExaminationCenter[],
  ) {
    super(id, createdAt, updatedAt);
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

  public get virtualCampuses(): VirtualCampus[] {
    return this._virtualCampuses;
  }

  public set virtualCampuses(value: VirtualCampus[]) {
    this._virtualCampuses = value;
  }

  public get examinationCenters(): ExaminationCenter[] {
    return this._examinationCenters;
  }

  public set examinationCenters(value: ExaminationCenter[]) {
    this._examinationCenters = value;
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
      [],
      [],
    );
  }

  public update(
    name: string,
    code: string,
    country: Country,
    user: AdminUser,
    isActive: boolean,
    examinationCenters: ExaminationCenter[],
  ): void {
    this._name = name;
    this._code = code;
    this._country = country;
    this._updatedBy = user;
    this.updatedAt = new Date();
    this._isActive = isActive;
    this._examinationCenters = examinationCenters;
  }

  public addExaminationCenter(examinationCenter: ExaminationCenter): void {
    if (
      this._examinationCenters.find(
        (examCenter) => examCenter.id === examinationCenter.id,
      )
    ) {
      throw new ExaminationCenterAlreadyAddedException();
    }
    this._examinationCenters.push(examinationCenter);
  }

  public removeExaminationCenter(examinationCenter: ExaminationCenter): void {
    if (examinationCenter.mainBusinessUnit?.id === this.id) {
      throw new ExaminationCenterMainException();
    }

    this._examinationCenters = this._examinationCenters.filter(
      (examCenter) => examCenter.id !== examinationCenter.id,
    );
  }
}
