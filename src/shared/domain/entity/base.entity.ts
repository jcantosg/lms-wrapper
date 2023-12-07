export abstract class BaseEntity {
  private readonly _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(id: string, createdAt: Date, updatedAt: Date) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(date: Date) {
    this._createdAt = date;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(date: Date) {
    this._updatedAt = date;
  }

  public updated(): void {
    this._updatedAt = new Date();
  }
}
