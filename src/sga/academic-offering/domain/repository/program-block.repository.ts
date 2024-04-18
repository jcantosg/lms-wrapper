import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export abstract class ProgramBlockRepository {
  abstract existsById(id: string): Promise<boolean>;

  abstract save(programBlock: ProgramBlock): Promise<void>;

  abstract get(id: string): Promise<ProgramBlock | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ProgramBlock | null>;

  abstract delete(programBlock: ProgramBlock): Promise<void>;
}
