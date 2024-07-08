import { QueryHandler } from '#shared/domain/bus/query.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { GetLmsCourseProgressHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { GetSubjectProgressQuery } from '#student-360/academic-offering/subject/application/get-subject-progress/get-subject-progress.query';
import { GetLmsCourseProgressQuery } from '#/lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.query';

export class GetSubjectProgressHandler implements QueryHandler {
  constructor(
    private readonly subjectGetter: SubjectGetter,
    private readonly getLmsCourseProgressHandler: GetLmsCourseProgressHandler,
  ) {}

  async handle(query: GetSubjectProgressQuery): Promise<number> {
    const subject = await this.subjectGetter.get(query.subjectId);

    return await this.getLmsCourseProgressHandler.handle(
      new GetLmsCourseProgressQuery(
        subject.lmsCourse!.value.id,
        query.student.lmsStudent!.value.id,
      ),
    );
  }
}
