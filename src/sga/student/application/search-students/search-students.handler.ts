import { QueryHandler } from '#shared/domain/bus/query.handler';
import { StudentRepository } from '#/student-360/student/domain/repository/student.repository';
import { SearchStudentsQuery } from '#student/application/search-students/search-students.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { Student } from '#shared/domain/entity/student.entity';
import { SearchStudentsCriteria } from '#student/application/search-students/search-students.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class SearchStudentsHandler implements QueryHandler {
  constructor(private readonly repository: StudentRepository) {}

  async handle(
    query: SearchStudentsQuery,
  ): Promise<CollectionHandlerResponse<Student>> {
    const criteria = new SearchStudentsCriteria(query);
    const [total, students] = await Promise.all([
      await this.repository.count(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
      await this.repository.matching(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
    ]);

    return {
      total: total,
      items: students,
    };
  }
}
