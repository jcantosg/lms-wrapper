import { BaseEntity } from '#shared/domain/entity/base.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { Student } from '#shared/domain/entity/student.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class Chatroom extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _chatroomId: string | null,
    private _internalGroup: InternalGroup,
    private _student: Student,
    private _teacher: EdaeUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    internalGroup: InternalGroup,
    student: Student,
    teacher: EdaeUser,
  ): Chatroom {
    return new Chatroom(
      id,
      new Date(),
      new Date(),
      null,
      internalGroup,
      student,
      teacher,
    );
  }

  get internalGroup(): InternalGroup {
    return this._internalGroup;
  }

  set internalGroup(internalGroup: InternalGroup) {
    this._internalGroup = internalGroup;
  }

  get student(): Student {
    return this._student;
  }

  set student(student: Student) {
    this._student = student;
  }

  get teacher(): EdaeUser {
    return this._teacher;
  }

  set teacher(teacher: EdaeUser) {
    this._teacher = teacher;
  }

  get chatroomId(): string | null {
    return this._chatroomId;
  }

  set chatroomId(chatroomId: string | null) {
    this._chatroomId = chatroomId;
  }
}
