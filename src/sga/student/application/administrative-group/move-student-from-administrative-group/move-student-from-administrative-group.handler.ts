import { CommandHandler } from '#shared/domain/bus/command.handler';
import { MoveStudentFromAdministrativeGroupCommand } from './move-student-from-administrative-group.command';
import { Student } from '#shared/domain/entity/student.entity';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { StudentRepository } from '#student-360/student/domain/repository/student.repository';

export class MoveStudentFromAdministrativeGroupHandler
  implements CommandHandler
{
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
  ) {}

  async handle(
    command: MoveStudentFromAdministrativeGroupCommand,
  ): Promise<void> {
    const {
      studentIds,
      administrativeGroupOriginId,
      administrativeGroupDestinationId,
      adminUser,
    } = command;

    try {
      const originGroup = await this.administrativeGroupGetter.getByAdminUser(
        administrativeGroupOriginId,
        adminUser,
      );

      const destinationGroup =
        await this.administrativeGroupGetter.getByAdminUser(
          administrativeGroupDestinationId,
          adminUser,
        );

      const students = await this.findStudentsByIds(studentIds);

      this.validateStudentsInOriginGroup(studentIds, originGroup.students);

      await this.administrativeGroupRepository.moveStudents(
        students,
        originGroup,
        destinationGroup,
      );
    } catch (error) {
      throw error;
    }
  }

  private async findStudentsByIds(ids: string[]): Promise<Student[]> {
    const students: Student[] = [];
    for (const id of ids) {
      const student = await this.studentRepository.get(id);
      if (!student) {
        throw new StudentNotFoundException();
      }
      students.push(student);
    }

    return students;
  }

  private validateStudentsInOriginGroup(
    studentIds: string[],
    originGroupStudents: Student[],
  ): void {
    const studentIdsInOriginGroup = originGroupStudents.map(
      (student) => student.id,
    );
    const missingStudentIds = studentIds.filter(
      (id) => !studentIdsInOriginGroup.includes(id),
    );

    if (missingStudentIds.length > 0) {
      throw new StudentNotFoundException();
    }
  }
}
