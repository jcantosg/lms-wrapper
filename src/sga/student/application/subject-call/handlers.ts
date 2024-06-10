import { GetSubjectCallFinalGradesHandler } from '#student/application/subject-call/get-subject-call-final-grades/get-subject-call-final-grades.handler';
import { EditSubjectCallHandler } from '#student/application/subject-call/edit-subject-call/edit-subject-call.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import { AddSubjectCallHandler } from '#student/application/subject-call/add-subject-call/add-subject-call.handler';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { RemoveSubjectCallHandler } from '#student/application/subject-call/remove-subject-call/remove-subject-call.handler';

const editSubjectCallHandler = {
  provide: EditSubjectCallHandler,
  useFactory: (
    repository: SubjectCallRepository,
    subjectCallGetter: SubjectCallGetter,
  ): EditSubjectCallHandler =>
    new EditSubjectCallHandler(repository, subjectCallGetter),
  inject: [SubjectCallRepository, SubjectCallGetter],
};

const addSubjectCallHandler = {
  provide: AddSubjectCallHandler,
  useFactory: (
    repository: SubjectCallRepository,
    enrollmentGetter: EnrollmentGetter,
  ): AddSubjectCallHandler =>
    new AddSubjectCallHandler(repository, enrollmentGetter),
  inject: [SubjectCallRepository, EnrollmentGetter],
};

const removeSubjectCallHandler = {
  provide: RemoveSubjectCallHandler,
  useFactory: (
    repository: SubjectCallRepository,
    subjectCallGetter: SubjectCallGetter,
  ): RemoveSubjectCallHandler =>
    new RemoveSubjectCallHandler(repository, subjectCallGetter),
  inject: [SubjectCallRepository, SubjectCallGetter],
};

export const subjectCallHandlers = [
  GetSubjectCallFinalGradesHandler,
  editSubjectCallHandler,
  addSubjectCallHandler,
  removeSubjectCallHandler,
];
