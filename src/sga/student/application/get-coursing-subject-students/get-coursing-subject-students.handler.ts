import { QueryHandler } from '#shared/domain/bus/query.handler';
import { Student } from '#shared/domain/entity/student.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { GetCoursingSubjectStudentsQuery } from '#student/application/get-coursing-subject-students/get-coursing-subject-students.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

export class GetCoursingSubjectStudentsHandler implements QueryHandler {
  constructor(
    private readonly subjectGetter: SubjectGetter,
    private readonly enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(query: GetCoursingSubjectStudentsQuery): Promise<Student[]> {
    const subject = await this.subjectGetter.getByAdminUser(
      query.subjectId,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const enrollments = await this.enrollmentGetter.getBySubject(
      subject,
      query.adminUser,
    );

    const ongoingEnrollments = enrollments.filter(
      (enrollment) =>
        enrollment.academicRecord.status === AcademicRecordStatusEnum.VALID,
    );

    return ongoingEnrollments.map(
      (enrollment) => enrollment.academicRecord.student,
    );
  }
}
