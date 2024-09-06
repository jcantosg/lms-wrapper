import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { getDateFormattedMMYY } from '#shared/domain/lib/date';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

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
  subject: {
    id: string;
    name: string;
    code: string;
    type: SubjectType;
  };
  maxCalls: number;
}

export class GetEnrollmentsByAcademicRecordResponse {
  static create(
    enrollments: Enrollment[],
  ): GetEnrollmentByAcademicRecordResponse[] {
    return enrollments
      .sort((a, b) => a.programBlock.name.localeCompare(b.programBlock.name))
      .map((enrollment: Enrollment) => {
        return {
          id: enrollment.id,
          name: enrollment.subject.name,
          visible: enrollment.visibility,
          type: enrollment.type,
          block: enrollment.programBlock.name,
          hours: enrollment.subject.hours,
          subjectCalls:
            GetEnrollmentsByAcademicRecordResponse.orderSubjectsCall(
              enrollment.calls,
            ).map((subjectCall: SubjectCall) => {
              return {
                id: subjectCall.id,
                callDate: getDateFormattedMMYY(subjectCall.callDate),
                finalGrade: subjectCall.finalGrade,
                status: subjectCall.status,
                number: subjectCall.callNumber,
              };
            }),
          subject: {
            id: enrollment.subject.id,
            name: enrollment.subject.name,
            code: enrollment.subject.code,
            type: enrollment.subject.type,
            isRegulated: enrollment.subject.isRegulated,
          },
          maxCalls: enrollment.maxCalls,
        };
      });
  }

  private static orderSubjectsCall(subjectCalls: SubjectCall[]): SubjectCall[] {
    return subjectCalls.sort((a, b) => {
      if (b.callNumber !== a.callNumber) {
        return b.callNumber - a.callNumber;
      }

      return b.callDate.getTime() - a.callDate.getTime();
    });
  }
}
