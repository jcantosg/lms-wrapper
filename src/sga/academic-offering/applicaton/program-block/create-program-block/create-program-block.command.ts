import { Command } from '#shared/domain/bus/command';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateProgramBlockCommand implements Command {
  constructor(
    public readonly academicProgramId: string,
    public readonly structureType: ProgramBlockStructureType,
    public readonly blocks: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
