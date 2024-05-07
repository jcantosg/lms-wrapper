import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';

export class BlockRelation extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _periodBlock: PeriodBlock,
    private _programBlock: ProgramBlock,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get periodBlock(): PeriodBlock {
    return this._periodBlock;
  }

  public set periodBlock(value: PeriodBlock) {
    this._periodBlock = value;
  }

  public get programBlock(): ProgramBlock {
    return this._programBlock;
  }

  public set programBlock(value: ProgramBlock) {
    this._programBlock = value;
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
    periodBlock: PeriodBlock,
    programBlock: ProgramBlock,
    user: AdminUser,
  ): BlockRelation {
    return new BlockRelation(
      id,
      new Date(),
      new Date(),
      periodBlock,
      programBlock,
      user,
      user,
    );
  }
}
