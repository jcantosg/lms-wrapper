import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriodWrongBlockNumberException } from '#shared/domain/exception/academic-offering/academic-period.wrong-block-number.exception';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramWrongBlockNumberException } from '#shared/domain/exception/academic-offering/academic-program.wrong-block-number.exception';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { PeriodBlockNotFoundException } from '#shared/domain/exception/academic-offering/period-block.not-found.exception';

const MIN_BLOCK_NUMBER = 1;

export class AcademicPeriod extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _code: string,
    private _startDate: Date,
    private _endDate: Date,
    private _businessUnit: BusinessUnit,
    private _blocksNumber: number,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _academicPrograms: AcademicProgram[],
    private _periodBlocks: PeriodBlock[],
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    name: string,
    code: string,
    startDate: Date,
    endDate: Date,
    businessUnit: BusinessUnit,
    blocksNumber: number,
    user: AdminUser,
  ): AcademicPeriod {
    if (blocksNumber < MIN_BLOCK_NUMBER) {
      throw new AcademicPeriodWrongBlockNumberException();
    }

    return new AcademicPeriod(
      id,
      name,
      code,
      startDate,
      endDate,
      businessUnit,
      blocksNumber,
      new Date(),
      new Date(),
      user,
      user,
      [],
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

  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(value: Date) {
    this._startDate = value;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(value: Date) {
    this._endDate = value;
  }

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
  }

  public get blocksNumber(): number {
    return this._blocksNumber;
  }

  public set blocksNumber(value: number) {
    this._blocksNumber = value;
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

  public get academicPrograms(): AcademicProgram[] {
    return this._academicPrograms;
  }

  public set academicPrograms(value: AcademicProgram[]) {
    this._academicPrograms = value;
  }

  public get periodBlocks(): PeriodBlock[] {
    return this._periodBlocks;
  }

  public set periodBlocks(value: PeriodBlock[]) {
    this._periodBlocks = value;
  }

  public addPeriodBlocks(blocks: PeriodBlock[]) {
    for (const block of blocks) {
      this._periodBlocks.push(block);
    }
  }

  public removeAcademicProgram(academicProgram: AcademicProgram) {
    this._academicPrograms = this._academicPrograms.filter(
      (ap) => ap.id !== academicProgram.id,
    );
  }

  public addAcademicProgram(academicProgram: AcademicProgram) {
    if (academicProgram.programBlocks.length !== this._blocksNumber) {
      throw new AcademicProgramWrongBlockNumberException();
    }

    if (
      !this._academicPrograms.find(
        (acadProgram) => acadProgram.id === academicProgram.id,
      )
    ) {
      this._academicPrograms.push(academicProgram);
    }
  }

  public hasAcademicPrograms(): boolean {
    return this._academicPrograms.length > 0;
  }

  public update(
    name: string,
    code: string,
    startDate: Date,
    endDate: Date,
    adminUser: AdminUser,
  ): void {
    this._name = name;
    this._code = code;
    this._startDate = startDate;
    this._endDate = endDate;
    this._updatedBy = adminUser;
    this.updated();
  }

  public isLastBlock(periodBlock: PeriodBlock): boolean {
    const sortedBlocks = this._periodBlocks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );

    return sortedBlocks[sortedBlocks.length - 1].id === periodBlock.id;
  }

  public getNextBlock(periodBlock: PeriodBlock): PeriodBlock {
    const sortedBlocks = this._periodBlocks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
    const current = sortedBlocks.find((pb) => pb.id === periodBlock.id);
    if (!current) {
      throw new PeriodBlockNotFoundException();
    }
    const index = sortedBlocks.indexOf(current) + 1;
    const next = sortedBlocks[index];
    if (!next) {
      throw new PeriodBlockNotFoundException();
    }

    return next;
  }
}
