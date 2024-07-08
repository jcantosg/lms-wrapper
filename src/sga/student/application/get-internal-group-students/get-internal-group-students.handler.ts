import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { StudentRepository } from '#student-360/student/domain/repository/student.repository';
import { GetInternalGroupStudentsQuery } from '#student/application/get-internal-group-students/get-internal-group-students.query';
import { GetInternalGroupStudentsCriteria } from '#student/application/get-internal-group-students/get-internal-group-students.criteria';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { Student } from '#shared/domain/entity/student.entity';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

export interface InternalGroupStudent {
  id: string;
  name: string;
  surname: string;
  surname2: string;
  documentNumber: string;
  enrollmentId: string | undefined;
  subjectStatus: SubjectCallStatusEnum | undefined;
  avatar: string | null;
}

export class GetInternalGroupStudentsHandler implements QueryHandler {
  constructor(
    private readonly repository: StudentRepository,
    private readonly internalGroupGetter: InternalGroupGetter,
    private readonly enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(
    query: GetInternalGroupStudentsQuery,
  ): Promise<CollectionHandlerResponse<InternalGroupStudent>> {
    const internalGroup = await this.internalGroupGetter.getByAdminUser(
      query.internalGroupId,
      query.adminUser,
    );

    const criteria = new GetInternalGroupStudentsCriteria(query);
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

    const internalGroupStudents: InternalGroupStudent[] = [];
    for (const student of students) {
      const enrollment = await this.getEnrollment(student, internalGroup);

      internalGroupStudents.push({
        id: student.id,
        name: student.name,
        surname: student.surname,
        surname2: student.surname2,
        documentNumber: student.identityDocument?.identityDocumentNumber ?? '',
        enrollmentId: enrollment ? enrollment.id : undefined,
        subjectStatus: enrollment
          ? this.getSubjectStatus(enrollment)
          : undefined,
        avatar: student.avatar,
      });
    }

    return {
      total: total,
      items: internalGroupStudents,
    };
  }

  private getSubjectStatus(enrollment: Enrollment): SubjectCallStatusEnum {
    return enrollment.calls.sort(
      (a, b) => b.callDate.getTime() - a.callDate.getTime(),
    )[0].status;
  }

  private async getEnrollment(
    student: Student,
    internalGroup: InternalGroup,
  ): Promise<Enrollment | undefined> {
    const academicRecord = student.academicRecords.find(
      (ar) => ar.status === AcademicRecordStatusEnum.VALID,
    );

    if (academicRecord) {
      const enrollments =
        await this.enrollmentGetter.getByAcademicRecord(academicRecord);

      const enrollment = enrollments.find(
        (enrollment) => enrollment.subject.id === internalGroup.subject.id,
      );

      if (enrollment) {
        return enrollment;
      }
    }
  }
}