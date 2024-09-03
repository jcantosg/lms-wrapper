import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { GetCommunicationQuery } from '#shared/application/communication/get-communication/get-communication.query';
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { CommunicationDetail } from '#shared/application/communication/search-communications/search-communications.handler';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { Student } from '#shared/domain/entity/student.entity';

export class GetCommunicationHandler implements QueryHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly studentGetter: StudentGetter,
  ) {}

  async handle(query: GetCommunicationQuery): Promise<CommunicationDetail> {
    const communication = await this.repository.get(query.id);

    if (!communication) {
      throw new CommunicationNotFoundException();
    }

    return {
      communication,
      count: (
        await this.getAllStudents(
          communication.students ? communication.students.map((s) => s.id) : [],
          communication.internalGroups,
          communication.academicPrograms,
        )
      ).length,
    };
  }

  private async getAllStudents(
    studentIds: string[],
    internalGroups: InternalGroup[],
    academicPrograms: AcademicProgram[],
  ) {
    if (studentIds.length > 0) {
      return await Promise.all(
        studentIds.map((id) => this.studentGetter.get(id)),
      );
    }

    if (internalGroups && internalGroups.length > 0) {
      const internalGroupsStudents: Student[] = [];
      for (const internalGroup of internalGroups) {
        if (internalGroup.students && internalGroup.students.length > 0) {
          internalGroupsStudents.push(...internalGroup.students);
        }
      }

      return this.uniqueStudents(internalGroupsStudents);
    }

    if (academicPrograms && academicPrograms.length > 0) {
      return this.uniqueStudents(
        await this.studentGetter.getByAcademicProgramsAndGroups(
          academicPrograms.map((ap) => ap.id),
          [],
        ),
      );
    }

    return [];
  }

  private uniqueStudents(students: Student[]): Student[] {
    return students.reduce((accumulator: Student[], current: Student) => {
      if (!accumulator.find((student) => student.id === current.id)) {
        accumulator.push(current);
      }

      return accumulator;
    }, []);
  }
}
