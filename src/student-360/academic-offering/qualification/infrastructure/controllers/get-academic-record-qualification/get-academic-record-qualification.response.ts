import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectType } from 'aws-sdk/clients/sts';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';

export interface GetAcademicRecordQualificationResponseBody {
  isPassed: boolean | null;
  subject: {
    evaluationType: string | null;
    modality: SubjectModality;
    name: string;
    id: string;
    type: SubjectType;
  };
  progress: number | null;
  finalGrade: SubjectCallFinalGradeEnum | null;
  assistanceGrade: number | null;
  examGrade: number | null;
}

export class GetAcademicRecordQualificationResponse {
  static create(
    subjectCalls: SubjectCall[],
  ): GetAcademicRecordQualificationResponseBody[] {
    return subjectCalls.map((subjectCall: SubjectCall) => {
      return {
        subject: {
          id: subjectCall.enrollment.subject.id,
          name: subjectCall.enrollment.subject.name,
          evaluationType: subjectCall.enrollment.subject.evaluationType
            ? subjectCall.enrollment.subject.evaluationType.name
            : null,
          type: subjectCall.enrollment.subject.type,
          modality: subjectCall.enrollment.subject.modality,
        },
        progress: null,
        assistanceGrade: null,
        examGrade: null,
        finalGrade: subjectCall.finalGrade,
        isPassed: subjectCall.enrollment.subject.evaluationType?.isPassed
          ? subjectCall.enrollment.subject.evaluationType?.isPassed
          : null,
      };
    });
  }
}
