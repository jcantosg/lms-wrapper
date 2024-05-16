import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { getDateFormattedMMYY } from '#shared/domain/lib/date';

interface GetEnrollmentByAcademicRecordResponse {
  id: string;
  name: string;
  visible: EnrollmentVisibilityEnum;
  type: EnrollmentTypeEnum;
  block: string;
  hours: number | null;
  subjectCalls: {
    id: string;
    callDate: string;
    finalGrade: SubjectCallFinalGradeEnum;
    status: SubjectCallStatusEnum;
  }[];
}

export class GetEnrollmentsByAcademicRecordResponse {
  static create(
    enrollments: Enrollment[],
  ): GetEnrollmentByAcademicRecordResponse[] {
    return enrollments.map((enrollment: Enrollment) => {
      return {
        id: enrollment.id,
        name: enrollment.subject.name,
        visible: enrollment.visibility,
        type: enrollment.type,
        block: enrollment.programBlock.name,
        hours: enrollment.subject.hours,
        subjectCalls: enrollment.calls.map((call: SubjectCall) => {
          return {
            id: call.id,
            callDate: getDateFormattedMMYY(call.callDate),
            finalGrade: call.finalGrade,
            status: call.status,
          };
        }),
      };
    });
  }
}
