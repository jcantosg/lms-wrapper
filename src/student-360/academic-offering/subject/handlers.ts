import { GetSubjectHandler } from '#/student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';

export const getSubjectHandler = {
  provide: GetSubjectHandler,
  useFactory: (subjectGetter: SubjectGetter): GetSubjectHandler =>
    new GetSubjectHandler(subjectGetter),
  inject: [SubjectGetter],
};

export const studentSubjectHandlers = [getSubjectHandler];
