import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EvaluationTypeNotFoundException } from '#shared/domain/exception/academic-offering/evaluation-type.not-found.exception';
import { SubjectBelowZeroHoursException } from '#shared/domain/exception/academic-offering/subject.below-zero-hours.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class Subject extends BaseEntity {
  private constructor(
    id: string,
    private _image: string | null,
    private _name: string,
    private _code: string,
    private _officialCode: string | null,
    private _hours: number,
    private _modality: SubjectModality,
    private _evaluationType: EvaluationType | null,
    private _type: SubjectType,
    private _businessUnit: BusinessUnit,
    private _teachers: EdaeUser[],
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _isRegulated: boolean = true,
    private _isCore: boolean = true,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get image(): string | null {
    return this._image;
  }

  public set image(value: string | null) {
    this._image = value;
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

  public get officialCode(): string | null {
    return this._officialCode;
  }

  public set officialCode(value: string | null) {
    this._officialCode = value;
  }

  public get hours(): number {
    return this._hours;
  }

  public set hours(value: number) {
    this._hours = value;
  }

  public get modality(): SubjectModality {
    return this._modality;
  }

  public set modality(value: SubjectModality) {
    this._modality = value;
  }

  public get evaluationType(): EvaluationType | null {
    return this._evaluationType;
  }

  public set evaluationType(value: EvaluationType | null) {
    this._evaluationType = value;
  }

  public get type(): SubjectType {
    return this._type;
  }

  public set type(value: SubjectType) {
    this._type = value;
  }

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
  }

  public get isRegulated(): boolean {
    return this._isRegulated;
  }

  public set isRegulated(value: boolean) {
    this._isRegulated = value;
  }

  public get isCore(): boolean {
    return this._isCore;
  }

  public set isCore(value: boolean) {
    this._isCore = value;
  }

  public get teachers(): EdaeUser[] {
    return this._teachers;
  }

  public set teachers(value: EdaeUser[]) {
    this._teachers = value;
  }

  public get createdBy(): AdminUser {
    return this._createdBy;
  }

  public set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  static create(
    id: string,
    imageUrl: string | null,
    name: string,
    code: string,
    officialCode: string | null,
    hours: number,
    modality: SubjectModality,
    evaluationType: EvaluationType | null,
    type: SubjectType,
    businessUnit: BusinessUnit,
    isRegulated: boolean,
    isCore: boolean,
    user: AdminUser,
  ) {
    if (isRegulated && !evaluationType) {
      throw new EvaluationTypeNotFoundException();
    }
    if (hours <= 0) {
      throw new SubjectBelowZeroHoursException();
    }
    const assignedEvaluationType: EvaluationType | null = isRegulated
      ? evaluationType
      : null;

    return new Subject(
      id,
      imageUrl,
      name,
      code,
      officialCode,
      hours,
      modality,
      assignedEvaluationType,
      type,
      businessUnit,
      [],
      new Date(),
      new Date(),
      user,
      user,
      isRegulated,
      isCore,
    );
  }

  update(
    name: string,
    code: string,
    hours: number,
    officialCode: string | null,
    image: string | null,
    modality: SubjectModality,
    evaluationType: EvaluationType | null,
    type: SubjectType,
    isRegulated: boolean,
    isCore: boolean,
    user: AdminUser,
  ) {
    if (isRegulated && !evaluationType) {
      throw new EvaluationTypeNotFoundException();
    }
    if (hours <= 0) {
      throw new SubjectBelowZeroHoursException();
    }
    const assignedEvaluationType: EvaluationType | null = isRegulated
      ? evaluationType
      : null;

    this.name = name;
    this.code = code;
    this.hours = hours;
    this.officialCode = officialCode;
    this.image = image;
    this.modality = modality;
    this.evaluationType = assignedEvaluationType;
    this.type = type;
    this.isRegulated = isRegulated;
    this.isCore = isCore;
    this.updatedBy = user;
    this.updatedAt = new Date();
  }
}
