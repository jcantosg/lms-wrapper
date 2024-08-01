import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EvaluationTypeNotFoundException } from '#shared/domain/exception/academic-offering/evaluation-type.not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { SubjectInvalidEdaeUserRoleException } from '#shared/domain/exception/academic-offering/subject.invalid-edae-user-role.exception';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { Enrollment } from '#student/domain/entity/enrollment.entity';

export class Subject extends BaseEntity {
  private constructor(
    id: string,
    private _image: string | null,
    private _name: string,
    private _code: string,
    private _officialCode: string | null,
    private _hours: number | null,
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
    private _resources: SubjectResource[],
    private _officialRegionalCode: string | null,
    private _defaultTeacher: EdaeUser | null,
    private _programBlocks: ProgramBlock[],
    private _lmsCourse: LmsCourse | null,
    private _enrollments: Enrollment[],
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

  public get hours(): number | null {
    return this._hours;
  }

  public set hours(value: number | null) {
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

  public get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  public set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  public get resources(): SubjectResource[] {
    return this._resources;
  }

  public set resources(value: SubjectResource[]) {
    this._resources = value;
  }

  public get officialRegionalCode(): string | null {
    return this._officialRegionalCode;
  }

  public set officialRegionalCode(value: string | null) {
    this._officialRegionalCode = value;
  }

  public get defaultTeacher(): EdaeUser | null {
    return this._defaultTeacher;
  }

  public set defaultTeacher(value: EdaeUser | null) {
    this._defaultTeacher = value;
  }

  public get programBlocks(): ProgramBlock[] {
    return this._programBlocks;
  }

  public set programBlocks(value: ProgramBlock[]) {
    this._programBlocks = value;
  }

  public get lmsCourse(): LmsCourse | null {
    return this._lmsCourse;
  }

  public set lmsCourse(value: LmsCourse | null) {
    this._lmsCourse = value;
  }

  public get enrollments(): Enrollment[] {
    return this._enrollments;
  }

  public set enrollments(value: Enrollment[]) {
    this._enrollments = value;
  }

  static create(
    id: string,
    imageUrl: string | null,
    name: string,
    code: string,
    officialCode: string | null,
    hours: number | null,
    modality: SubjectModality,
    evaluationType: EvaluationType | null,
    type: SubjectType,
    businessUnit: BusinessUnit,
    isRegulated: boolean,
    isCore: boolean,
    user: AdminUser,
    officialRegionalCode: string | null,
  ) {
    if (isRegulated && !evaluationType) {
      throw new EvaluationTypeNotFoundException();
    }

    return new Subject(
      id,
      imageUrl,
      name,
      code,
      officialCode,
      hours,
      modality,
      evaluationType,
      type,
      businessUnit,
      [],
      new Date(),
      new Date(),
      user,
      user,
      isRegulated,
      isCore,
      [],
      officialRegionalCode,
      null,
      [],
      null,
      [],
    );
  }

  public update(
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
    officialRegionalCode: string | null,
    lmsCourse: LmsCourse | null,
  ) {
    if (isRegulated && !evaluationType) {
      throw new EvaluationTypeNotFoundException();
    }

    this.name = name;
    this.code = code;
    this.hours = hours;
    this.officialCode =
      officialCode !== '' && officialCode !== undefined ? officialCode : null;
    this.image = image;
    this.modality = modality;
    this.evaluationType = evaluationType;
    this.type = type;
    this.isRegulated = isRegulated;
    this.isCore = isCore;
    this.officialRegionalCode =
      officialRegionalCode !== '' && officialRegionalCode !== undefined
        ? officialRegionalCode
        : null;
    this.updatedBy = user;
    this.updatedAt = new Date();
    this.lmsCourse = lmsCourse;
  }

  public addTeacher(teacher: EdaeUser) {
    if (!teacher.isTeacher()) {
      throw new SubjectInvalidEdaeUserRoleException();
    }

    if (!this._teachers.find((teachEdae) => teachEdae.id === teacher.id)) {
      this._teachers.push(teacher);
    }
  }

  public addDefaultTeacher(teacher: EdaeUser) {
    if (!teacher.isTeacher()) {
      throw new SubjectInvalidEdaeUserRoleException();
    }

    this._defaultTeacher = teacher;
  }

  public removeTeacher(teacher: EdaeUser) {
    this._teachers = this._teachers.filter((t) => t.id !== teacher.id);
  }

  public isDefaultTeacher(teacher: EdaeUser): boolean {
    return this._defaultTeacher?.id === teacher.id;
  }

  public addLmsCourse(lmsCourse: LmsCourse | null): void {
    this.lmsCourse = lmsCourse;
  }

  public isSpeciality(): boolean {
    return this.type === SubjectType.SPECIALTY;
  }
}
