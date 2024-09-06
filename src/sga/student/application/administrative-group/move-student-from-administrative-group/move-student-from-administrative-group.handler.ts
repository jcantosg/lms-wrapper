import { CommandHandler } from '#shared/domain/bus/command.handler';
import { MoveStudentFromAdministrativeGroupCommand } from './move-student-from-administrative-group.command';
import { Student } from '#shared/domain/entity/student.entity';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';

export class MoveStudentFromAdministrativeGroupHandler
  implements CommandHandler
{
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
    private readonly transactionalService: TransactionalService,
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly enrollmentGetter: EnrollmentGetter,
    private readonly updateInternalGroupsService: UpdateInternalGroupsService,
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

      return await this.moveStudents(
        originGroup,
        destinationGroup,
        students,
        adminUser,
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

  private async moveStudents(
    originGroup: AdministrativeGroup,
    destinationGroup: AdministrativeGroup,
    students: Student[],
    adminUser: AdminUser,
  ) {
    const isChangedAcademicPeriod =
      originGroup.academicPeriod.id !== destinationGroup.academicPeriod.id;

    for (const student of students) {
      originGroup.removeStudent(student);
      destinationGroup.addStudent(student);
      const academicRecord =
        await this.academicRecordRepository.getStudentAcademicRecordByPeriodAndProgram(
          student.id,
          originGroup.academicPeriod.id,
          originGroup.academicProgram.id,
        );

      if (!academicRecord) {
        throw new AcademicRecordNotFoundException();
      }

      const enrollments =
        await this.enrollmentGetter.getByAcademicRecord(academicRecord);

      const internalGroups = isChangedAcademicPeriod
        ? await this.updateInternalGroupsService.update(
            student,
            academicRecord,
            enrollments,
            destinationGroup.academicPeriod,
            academicRecord.academicProgram,
            adminUser,
          )
        : [];

      academicRecord.updateAcademicPeriod(
        destinationGroup.academicPeriod,
        adminUser,
      );

      await this.transactionalService.execute({
        academicRecord,
        internalGroups,
        originAdminGroup: originGroup,
        destinationAdminGroup: destinationGroup,
      });
    }
  }
}
