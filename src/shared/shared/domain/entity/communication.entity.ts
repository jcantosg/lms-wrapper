import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { Message } from '#shared/domain/value-object/message.value-object';

export class Communication extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _sentAt: Date | null,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _sentBy: AdminUser | null,
    private _businessUnits: BusinessUnit[],
    private _academicPeriods: AcademicPeriod[],
    private _titles: Title[],
    private _academicPrograms: AcademicProgram[],
    private _internalGroups: InternalGroup[],
    private _students: Student[],
    private _message: Message | null,
    private _sendByEmail: boolean | null,
    private _publishOnBoard: boolean | null,
    private _status: CommunicationStatus | null,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    createdBy: AdminUser,
    businessUnits: BusinessUnit[],
    academicPeriods: AcademicPeriod[],
    titles: Title[],
    academicPrograms: AcademicProgram[],
    internalGroups: InternalGroup[],
    students: Student[],
    sendByEmail: boolean | null,
    publishOnBoard: boolean | null,
    status: CommunicationStatus | null,
    message: Message | null,
  ): Communication {
    return new Communication(
      id,
      new Date(),
      new Date(),
      null,
      createdBy,
      createdBy,
      null,
      businessUnits,
      academicPeriods,
      titles,
      academicPrograms,
      internalGroups,
      students,
      message,
      sendByEmail,
      publishOnBoard,
      status,
    );
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

  get sentBy(): AdminUser | null {
    return this._sentBy;
  }

  set sentBy(value: AdminUser | null) {
    this._sentBy = value;
  }

  get message(): Message | null {
    return this._message;
  }

  set message(value: Message | null) {
    this._message = value;
  }

  get sendByEmail(): boolean | null {
    return this._sendByEmail;
  }

  set sendByEmail(value: boolean | null) {
    this._sendByEmail = value;
  }

  get publishOnBoard(): boolean | null {
    return this._publishOnBoard;
  }

  set publishOnBoard(value: boolean | null) {
    this._publishOnBoard = value;
  }

  get status(): CommunicationStatus | null {
    return this._status;
  }

  set status(value: CommunicationStatus | null) {
    this._status = value;
  }

  get sentAt(): Date | null {
    return this._sentAt;
  }

  set sentAt(value: Date | null) {
    this._sentAt = value;
  }

  get businessUnits(): BusinessUnit[] {
    return this._businessUnits;
  }

  set businessUnits(value: BusinessUnit[]) {
    this._businessUnits = value;
  }

  get academicPeriods(): AcademicPeriod[] {
    return this._academicPeriods;
  }

  set academicPeriods(value: AcademicPeriod[]) {
    this._academicPeriods = value;
  }

  get titles(): Title[] {
    return this._titles;
  }

  set titles(value: Title[]) {
    this._titles = value;
  }

  get academicPrograms(): AcademicProgram[] {
    return this._academicPrograms;
  }

  set academicPrograms(value: AcademicProgram[]) {
    this._academicPrograms = value;
  }

  get internalGroups(): InternalGroup[] {
    return this._internalGroups;
  }

  set internalGroups(value: InternalGroup[]) {
    this._internalGroups = value;
  }

  get students(): Student[] {
    return this._students;
  }

  set students(value: Student[]) {
    this._students = value;
  }

  public update(
    message: Message,
    sendByEmail: boolean,
    publishOnBoard: boolean,
    status: CommunicationStatus,
    sentAt: Date | null,
    updatedBy: AdminUser,
  ): void {
    this._message = message;
    this._sendByEmail = sendByEmail;
    this._publishOnBoard = publishOnBoard;
    this._status = status;
    this._sentAt = sentAt;
    this._updatedBy = updatedBy;
    this.updatedAt = new Date();
  }
}
