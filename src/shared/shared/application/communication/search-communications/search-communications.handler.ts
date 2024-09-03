import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { SearchCommunicationsQuery } from '#shared/application/communication/search-communications/search-communications.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { SearchCommunicationsCriteria } from '#shared/application/communication/search-communications/search-communications.criteria';
import { Communication } from '#shared/domain/entity/communication.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentGetter } from '#shared/domain/service/student-getter.service';

export interface CommunicationDetail {
  communication: Communication;
  count: number;
}

export class SearchCommunicationsHandler implements QueryHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly studentGetter: StudentGetter,
  ) {}

  async handle(
    query: SearchCommunicationsQuery,
  ): Promise<CollectionHandlerResponse<CommunicationDetail>> {
    const criteria = new SearchCommunicationsCriteria(query);
    const [communications, total] = await Promise.all([
      await this.repository.matching(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.isSuperAdmin(),
      ),
      await this.repository.count(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.isSuperAdmin(),
      ),
    ]);

    const items: CommunicationDetail[] = [];
    for (const communication of communications) {
      items.push({
        communication,
        count: (
          await this.getAllStudents(
            communication.students.map((s) => s.id),
            communication.internalGroups,
            communication.academicPrograms,
          )
        ).length,
      });
    }

    return {
      items,
      total,
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
