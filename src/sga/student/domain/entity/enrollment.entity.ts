import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { isSubjectCallTaken } from '#student/domain/enum/enrollment/subject-call-status.enum';

const MAX_CALLS = 4;

export class Enrollment extends BaseEntity {
  private constructor(
    id: string,
    private _subject: Subject,
    private _academicRecord: AcademicRecord,
    private _visibility: EnrollmentVisibilityEnum,
    private _type: EnrollmentTypeEnum,
    private _programBlock: ProgramBlock,
    private _calls: SubjectCall[],
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _maxCalls: number = MAX_CALLS,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    subject: Subject,
    academicRecord: AcademicRecord,
    visibility: EnrollmentVisibilityEnum,
    type: EnrollmentTypeEnum,
    programBlock: ProgramBlock,
    user: AdminUser,
  ): Enrollment {
    return new Enrollment(
      id,
      subject,
      academicRecord,
      visibility,
      type,
      programBlock,
      [],
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  static createUniversae(
    id: string,
    subject: Subject,
    academicRecord: AcademicRecord,
    programBlock: ProgramBlock,
    user: AdminUser,
  ): Enrollment {
    return new Enrollment(
      id,
      subject,
      academicRecord,
      EnrollmentVisibilityEnum.PD,
      EnrollmentTypeEnum.UNIVERSAE,
      programBlock,
      [],
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  public get subject(): Subject {
    return this._subject;
  }

  public set subject(value: Subject) {
    this._subject = value;
  }

  public get academicRecord(): AcademicRecord {
    return this._academicRecord;
  }

  public set academicRecord(value: AcademicRecord) {
    this._academicRecord = value;
  }

  public get visibility(): EnrollmentVisibilityEnum {
    return this._visibility;
  }

  public set visibility(value: EnrollmentVisibilityEnum) {
    this._visibility = value;
  }

  public get type(): EnrollmentTypeEnum {
    return this._type;
  }

  public set type(value: EnrollmentTypeEnum) {
    this._type = value;
  }

  public get programBlock(): ProgramBlock {
    return this._programBlock;
  }

  public set programBlock(value: ProgramBlock) {
    this._programBlock = value;
  }

  public get calls(): SubjectCall[] {
    return this._calls;
  }

  public set calls(value: SubjectCall[]) {
    this._calls = value;
  }

  public get maxCalls(): number {
    return this._maxCalls;
  }

  set maxCalls(value: number) {
    this._maxCalls = value;
  }

  get createdBy(): AdminUser {
    return this._createdBy;
  }

  set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  public addSubjectCall(subjectCall: SubjectCall): void {
    this.calls.push(subjectCall);
  }

  public update(
    type: EnrollmentTypeEnum,
    visibility: EnrollmentVisibilityEnum,
    maxCalls: number,
  ): void {
    this.type = type;
    this.visibility = visibility;
    this.maxCalls = maxCalls;
  }

  public isEnrollmentTaken(): boolean {
    if (this.calls.length > 1) {
      return true;
    }
    for (const call of this.calls) {
      if (isSubjectCallTaken(call)) {
        return true;
      }
    }

    return false;
  }
}
