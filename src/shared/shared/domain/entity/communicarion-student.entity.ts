import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Communication } from '#shared/domain/entity/communication.entity';
import { Student } from '#shared/domain/entity/student.entity';

export class CommunicationStudent extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _communication: Communication,
    private _student: Student,
    private _isRead: boolean,
    private _isDeleted: boolean,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    communication: Communication,
    student: Student,
    isRead: boolean = false,
    isDeleted: boolean = false,
  ): CommunicationStudent {
    return new CommunicationStudent(
      id,
      new Date(),
      new Date(),
      communication,
      student,
      isRead,
      isDeleted,
    );
  }

  get communication(): Communication {
    return this._communication;
  }

  set communication(value: Communication) {
    this._communication = value;
  }

  get student(): Student {
    return this._student;
  }

  set student(value: Student) {
    this._student = value;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  set isRead(value: boolean) {
    this._isRead = value;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  set isDeleted(value: boolean) {
    this._isDeleted = value;
  }

  public update(isRead: boolean, isDeleted: boolean): void {
    this._isRead = isRead;
    this._isDeleted = isDeleted;
    this.updatedAt = new Date();
  }

  public read() {
    this._isRead = true;
  }

  public delete() {
    this._isDeleted = true;
  }
}
