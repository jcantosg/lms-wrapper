import { QueryHandler } from '#shared/domain/bus/query.handler';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { GetStudentsQuery } from '#student/application/get-students/get-students.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { Student } from '#shared/domain/entity/student.entity';
import { GetStudentsCriteria } from '#student/application/get-students/get-students.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetStudentsHandler implements QueryHandler {
  constructor(private readonly repository: StudentRepository) {}

  async handle(
    query: GetStudentsQuery,
  ): Promise<CollectionHandlerResponse<Student>> {
    const criteria = new GetStudentsCriteria(query);
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
