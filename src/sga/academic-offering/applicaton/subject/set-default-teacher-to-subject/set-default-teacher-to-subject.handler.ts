import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { SetDefaultTeacherToSubjectCommand } from '#academic-offering/applicaton/subject/set-default-teacher-to-subject/set-default-teacher-to-subject.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { SubjectInvalidDefaultTeacherException } from '#shared/domain/exception/academic-offering/subject.invalid-default-teacher.exception';

export class SetDefaultTeacherToSubjectHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {}

  async handle(command: SetDefaultTeacherToSubjectCommand) {
    const subject = await this.subjectGetter.getByAdminUser(
      command.id,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const teacherToSetDefault = await this.edaeUserGetter.get(
      command.teacherId,
    );

    if (
      !subject.teachers
        .map((teacher) => teacher.id)
        .includes(teacherToSetDefault.id)
    ) {
      throw new SubjectInvalidDefaultTeacherException();
    }

    subject.addDefaultTeacher(teacherToSetDefault);
    await this.repository.save(subject);
  }
}
