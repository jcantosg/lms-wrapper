import { GetSubjectCallFinalGradesHandler } from '#student/application/subject-call/get-subject-call-final-grades/get-subject-call-final-grades.handler';
import { EditSubjectCallHandler } from '#student/application/subject-call/edit-subject-call/edit-subject-call.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';

const editSubjectCallHandler = {
  provide: EditSubjectCallHandler,
  useFactory: (
    repository: SubjectCallRepository,
    subjectCallGetter: SubjectCallGetter,
  ): EditSubjectCallHandler =>
    new EditSubjectCallHandler(repository, subjectCallGetter),
  inject: [SubjectCallRepository, SubjectCallGetter],
};

export const subjectCallHandlers = [
  GetSubjectCallFinalGradesHandler,
  editSubjectCallHandler,
];
