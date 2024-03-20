import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { AddEdaeUsersToSubjectCommand } from '#academic-offering/applicaton/add-edae-users-to-subject/add-edae-users-to-subject.command';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class AddEdaeUsersToSubjectHandler implements CommandHandler {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
    private readonly edaeUserBusinessUnitChecker: EdaeUserBusinessUnitChecker,
  ) {}

  async handle(command: AddEdaeUsersToSubjectCommand): Promise<void> {
    const subject = await this.subjectGetter.getByAdminUser(
      command.id,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const edaeUsersToAdd = await Promise.all(
      command.edaeUsers.map(
        async (edaeUserId: string) =>
          await this.edaeUserGetter.getByAdminUser(
            edaeUserId,
            command.adminUser.businessUnits.map((bu) => bu.id),
            command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
          ),
      ),
    );

    edaeUsersToAdd.forEach((edaeUser) => {
      const edaeUsersBusinessUnits = edaeUser.businessUnits.map((bu) => bu.id);
      if (!edaeUsersBusinessUnits.includes(subject.businessUnit.id)) {
        throw new EdaeUserNotFoundException();
      }

      subject.addTeacher(edaeUser);
    });

    await this.subjectRepository.save(subject);
  }
}
