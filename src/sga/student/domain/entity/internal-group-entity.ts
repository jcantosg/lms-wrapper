import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class InternalGroup extends BaseEntity {
  private constructor(
    id: string,
    private _code: string,
    private _students: Student[],
    private _teachers: EdaeUser[],
    private _academicPeriod: AcademicPeriod,
    private _academicProgram: AcademicProgram,
    private _periodBlock: PeriodBlock,
    private _subject: Subject,
    private _businessUnit: BusinessUnit,
    private _isDefault: boolean,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _defaultTeacher: EdaeUser | null,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get code(): string {
    return this._code;
  }

  public set code(value: string) {
    this._code = value;
  }

  public get students(): Student[] {
    return this._students;
  }

  public set students(value: Student[]) {
    this._students = value;
  }

  public addStudents(students: Student[]) {
    for (const student of students) {
      if (!this._students.find((st) => st.id === student.id)) {
        this._students.push(student);
      }
    }
  }

  public removeStudent(student: Student) {
    this._students = this._students.filter((st) => st.id !== student.id);
  }

  public get teachers(): EdaeUser[] {
    return this._teachers;
  }

  public set teachers(value: EdaeUser[]) {
    this._teachers = value;
  }

  public addTeachers(teachers: EdaeUser[]) {
    for (const teacher of teachers) {
      if (!this._teachers.find((te) => te.id === teacher.id)) {
        this._teachers.push(teacher);
      }
    }
  }

  public removeTeacher(teacher: EdaeUser) {
    this._teachers = this._teachers.filter((te) => te.id !== teacher.id);
  }

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
  }

  public get periodBlock(): PeriodBlock {
    return this._periodBlock;
  }

  public set periodBlock(value: PeriodBlock) {
    this._periodBlock = value;
  }

  public get subject(): Subject {
    return this._subject;
  }

  public set subject(value: Subject) {
    this._subject = value;
  }

  public get academicPeriod(): AcademicPeriod {
    return this._academicPeriod;
  }

  public set academicPeriod(value: AcademicPeriod) {
    this._academicPeriod = value;
  }

  public get academicProgram(): AcademicProgram {
    return this._academicProgram;
  }

  public set academicProgram(value: AcademicProgram) {
    this._academicProgram = value;
  }

  public get isDefault(): boolean {
    return this._isDefault;
  }

  public set isDefault(value: boolean) {
    this._isDefault = value;
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

  public get defaultTeacher(): EdaeUser | null {
    return this._defaultTeacher;
  }

  public set defaultTeacher(value: EdaeUser | null) {
    this._defaultTeacher = value;
  }

  static create(
    id: string,
    code: string,
    students: Student[],
    teachers: EdaeUser[],
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    periodBlock: PeriodBlock,
    subject: Subject,
    businessUnit: BusinessUnit,
    isDefault: boolean,
    user: AdminUser,
    defaultTeacher: EdaeUser | null,
  ): InternalGroup {
    return new InternalGroup(
      id,
      code,
      students,
      teachers,
      academicPeriod,
      academicProgram,
      periodBlock,
      subject,
      businessUnit,
      isDefault,
      new Date(),
      new Date(),
      user,
      user,
      defaultTeacher,
    );
  }

  update(code: string, isDefault: boolean) {
    this._code = code;
    this._isDefault = isDefault;
  }
}
