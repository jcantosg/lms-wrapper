import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  getAllSubjectFinalCallGrades,
  SubjectCallFinalGradeEnum,
} from '#student/domain/enum/enrollment/subject-call-final-grade.enum';

export class GetSubjectCallFinalGradesHandler implements QueryEmptyHandler {
  async handle(): Promise<SubjectCallFinalGradeEnum[]> {
    return getAllSubjectFinalCallGrades();
  }
}
