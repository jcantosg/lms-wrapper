import { CommandHandler } from '#shared/domain/bus/command.handler';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AddStudentToInternalGroupCommand } from '#student/application/add-student-to-internal-group/add-student-to-internal-group.command';
import { Student } from '#shared/domain/entity/student.entity';
import { AlreadyInInternalGroupException } from '#shared/domain/exception/sga-student/already-in-internal-group.exception';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { InternalGroupMemberAddedEvent } from '#student/domain/event/internal-group/internal-group-member-added.event';

export class AddStudentToInternalGroupHandler implements CommandHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly internalGroupGetter: InternalGroupGetter,
    private readonly studentGetter: StudentGetter,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: AddStudentToInternalGroupCommand) {
    const internalGroup: InternalGroup =
      await this.internalGroupGetter.getByAdminUser(
        command.internalGroupId,
        command.adminUser,
      );

    const students: Student[] = [];

    for (const studentId of command.studentIds) {
      const student = await this.studentGetter.get(studentId);
      if (
        await this.internalGroupGetter.getByStudentAndSubject(
          student,
          internalGroup.subject,
        )
      ) {
        throw new AlreadyInInternalGroupException();
      }
      students.push(student);
    }

    internalGroup.addStudents(students);
    await this.internalGroupRepository.save(internalGroup);

    await this.eventDispatcher.dispatch(
      new InternalGroupMemberAddedEvent(internalGroup),
    );
  }
}
