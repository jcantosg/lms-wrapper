import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class ProgramBlock extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _academicProgram: AcademicProgram,
    private _subjects: Subject[],
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get academicProgram(): AcademicProgram {
    return this._academicProgram;
  }

  public set academicProgram(value: AcademicProgram) {
    this._academicProgram = value;
  }

  public set subjects(value: Subject[]) {
    this._subjects = value;
  }

  public get subjects(): Subject[] {
    return this._subjects;
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

  public static create(
    id: string,
    name: string,
    academicProgram: AcademicProgram,
    user: AdminUser,
  ): ProgramBlock {
    return new ProgramBlock(
      id,
      name,
      academicProgram,
      [],
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  public updateByInfo(user: AdminUser) {
    this.updatedBy = user;
    this.updatedAt = new Date();
  }

  public update(name: string, user: AdminUser): void {
    this.name = name;
    this.updateByInfo(user);
  }

  public addSubject(subject: Subject, user: AdminUser): void {
    if (
      !this._subjects.find((subjectToFind) => subject.id === subjectToFind.id)
    ) {
      this._subjects.push(subject);
      this.updateByInfo(user);
    }
  }

  public removeSubject(subject: Subject): void {
    this._subjects = this._subjects.filter(
      (subjectToCompare: Subject) => subject.id !== subjectToCompare.id,
    );
  }

  public hasSubjects(): boolean {
    return this.subjects.length > 0;
  }
}
