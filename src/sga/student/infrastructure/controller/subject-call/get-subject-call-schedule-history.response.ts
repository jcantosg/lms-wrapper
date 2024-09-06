import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';

export interface GetSubjectCallScheduleHistoryResponse {
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
  academicPeriodName: string;
  academicProgramCount: number;
}

export class GetSubjectCallsScheduleHistoryResponse {
  static create(
    subjectCallsScheduleHisotry: SubjectCallScheduleHistory[],
  ): GetSubjectCallScheduleHistoryResponse[] {
    return subjectCallsScheduleHisotry.map((scsh) => ({
      id: scsh.id,
      createdBy: {
        id: scsh.createdBy.id,
        name: scsh.createdBy.name,
        surname: scsh.createdBy.surname,
        surname2: scsh.createdBy.surname2,
        avatar: scsh.createdBy.avatar,
      },
      createdAt: scsh.createdAt,
      businessUnit: {
        id: scsh.businessUnit.id,
        name: scsh.businessUnit.name,
      },
      academicPeriodName: scsh.academicPeriod.name,
      academicProgramCount: scsh.academicPrograms.length,
    }));
  }
}
