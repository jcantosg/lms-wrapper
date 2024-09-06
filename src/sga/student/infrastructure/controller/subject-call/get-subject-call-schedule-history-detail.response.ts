import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';

export interface GetSubjectCallScheduleHistoryDetail {
  id: string;
  createdBy: {
    id: string;
    name: string;
    surname: string;
    surname2: string | null;
    avatar: string;
  };
  createdAt: Date;
  businessUnit: {
    id: string;
    name: string;
  };
  academicPeriod: {
    id: string;
    name: string;
    code: string;
  };
  academicPrograms: {
    id: string;
    name: string;
    code: string;
  }[];
}

export class GetSubjectCallScheduleHistoryDetailResponse {
  static create(
    subjectCallScheduleHisotry: SubjectCallScheduleHistory,
  ): GetSubjectCallScheduleHistoryDetail {
    return {
      id: subjectCallScheduleHisotry.id,
      createdBy: {
        id: subjectCallScheduleHisotry.createdBy.id,
        name: subjectCallScheduleHisotry.createdBy.name,
        surname: subjectCallScheduleHisotry.createdBy.surname,
        surname2: subjectCallScheduleHisotry.createdBy.surname2,
        avatar: subjectCallScheduleHisotry.createdBy.avatar,
      },
      createdAt: subjectCallScheduleHisotry.createdAt,
      businessUnit: {
        id: subjectCallScheduleHisotry.businessUnit.id,
        name: subjectCallScheduleHisotry.businessUnit.name,
      },
      academicPeriod: {
        id: subjectCallScheduleHisotry.academicPeriod.id,
        name: subjectCallScheduleHisotry.academicPeriod.name,
        code: subjectCallScheduleHisotry.academicPeriod.code,
      },
      academicPrograms: subjectCallScheduleHisotry.academicPrograms.map(
        (ap) => ({ id: ap.id, name: ap.name, code: ap.code }),
      ),
    };
  }
}
