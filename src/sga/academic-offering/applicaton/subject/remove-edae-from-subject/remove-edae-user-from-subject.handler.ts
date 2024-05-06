import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RemoveEdaeUserFromSubjectCommand } from '#academic-offering/applicaton/subject/remove-edae-from-subject/remove-edae-user-from-subject.command';
import { SubjectDefaultTeacherException } from '#shared/domain/exception/academic-offering/subject.default-teacher.exception';

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
    if (subject.defaultTeacher?.id === command.edaeUser) {
      throw new SubjectDefaultTeacherException();
    }
    subject.removeTeacher(edaeToRemove);
    await this.subjectRepository.save(subject);
  }
}
