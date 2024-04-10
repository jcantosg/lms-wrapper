import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export class AcademicProgram extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _code: string,
    private _title: Title,
    private _businessUnit: BusinessUnit,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _structureType: ProgramBlockStructureType,
    private _programBlocks: ProgramBlock[],
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    name: string,
    code: string,
    title: Title,
    businessUnit: BusinessUnit,
    user: AdminUser,
    structureType: ProgramBlockStructureType,
  ): AcademicProgram {
    return new AcademicProgram(
      id,
      name,
      code,
      title,
      businessUnit,
      new Date(),
      new Date(),
      user,
      user,
      structureType,
      [],
    );
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

  public get title(): Title {
    return this._title;
  }

  public set title(value: Title) {
    this._title = value;
  }

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
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

  public get structureType(): ProgramBlockStructureType {
    return this._structureType;
  }

  public set structureType(value: ProgramBlockStructureType) {
    this._structureType = value;
  }

  public get programBlocks(): ProgramBlock[] {
    return this._programBlocks;
  }

  public set programBlocks(value: ProgramBlock[]) {
    this._programBlocks = value;
  }

  public update(
    name: string,
    code: string,
    title: Title,
    updatedBy: AdminUser,
  ): void {
    this.name = name;
    this.code = code;
    this.title = title;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }
}
