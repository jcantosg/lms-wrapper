import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

export class CreateAcademicProgramCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly titleId: string,
    public readonly businessUnitId: string,
    public readonly adminUser: AdminUser,
    public readonly structureType: ProgramBlockStructureType,
  ) {}
}
