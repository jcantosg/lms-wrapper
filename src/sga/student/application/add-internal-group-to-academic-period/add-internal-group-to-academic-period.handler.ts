import { CommandHandler } from '#shared/domain/bus/command.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { AddInternalGroupToAcademicPeriodCommand } from '#student/application/add-internal-group-to-academic-period/add-internal-group-to-academic-period.command';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { BlockRelationNotFoundException } from '#shared/domain/exception/academic-offering/block-relation.not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';

export class AddInternalGroupToAcademicPeriodHandler implements CommandHandler {
  constructor(
    private readonly repository: InternalGroupRepository,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly subjectGetter: SubjectGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly blockRelationRepository: BlockRelationRepository,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(
    command: AddInternalGroupToAcademicPeriodCommand,
  ): Promise<void> {
    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      command.academicPeriodId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (
      !academicPeriod.academicPrograms
        .map((program) => program.id)
        .includes(academicProgram.id)
    ) {
      throw new AcademicProgramNotFoundException();
    }

    const subject = await this.subjectGetter.getByAdminUser(
      command.subjectId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const programBlock = academicProgram.programBlocks.find((block) =>
      block.subjects.map((subject) => subject.id).includes(subject.id),
    );

    if (!programBlock) {
      throw new ProgramBlockNotFoundException();
    }

    const blockRelation =
      await this.blockRelationRepository.getByProgramBlockAndAcademicPeriod(
        programBlock,
        academicPeriod,
      );

    if (!blockRelation) {
      throw new BlockRelationNotFoundException();
    }

    const teachers: EdaeUser[] = [];
    await Promise.all(
      command.edaeUserIds.map(async (id) =>
        teachers.push(
          await this.edaeUserGetter.getByAdminUser(
            id,
            command.adminUser.businessUnits.map((bu) => bu.id),
            command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
          ),
        ),
      ),
    );

    const existentInternalGroups = await this.repository.getByKeys(
      academicPeriod,
      academicProgram,
      subject,
    );

    await this.repository.save(
      InternalGroup.create(
        command.id,
        `${command.prefix ?? ''}${command.prefix ? ' ' : ''}${
          academicProgram.code
        } ${subject.code} ${academicPeriod.code} ${
          existentInternalGroups.length
        }${command.sufix ? ' ' : ''}${command.sufix ?? ''}`,
        [],
        teachers,
        academicPeriod,
        academicProgram,
        blockRelation.periodBlock,
        subject,
        academicPeriod.businessUnit,
        existentInternalGroups.length === 0 || command.isDefaultGroup,
        command.adminUser,
        subject.defaultTeacher,
      ),
    );

    if (command.isDefaultGroup) {
      await Promise.all(
        existentInternalGroups.map(async (group) => {
          group.isDefault = false;
          await this.repository.save(group);
        }),
      );
    }
  }
}
