import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { RemoveEdaeUserFromSubjectCommand } from '#academic-offering/applicaton/remove-edae-from-subject/remove-edae-user-from-subject.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class RemoveEdaeUserFromSubjectHandler implements CommandHandler {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(command: RemoveEdaeUserFromSubjectCommand): Promise<void> {
    const subject = await this.subjectGetter.getByAdminUser(
      command.id,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const edaeToRemove = await this.edaeUserGetter.get(command.edaeUser);
    subject.removeTeacher(edaeToRemove);
    await this.subjectRepository.save(subject);
  }
}
