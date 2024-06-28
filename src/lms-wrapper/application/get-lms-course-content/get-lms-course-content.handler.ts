import { QueryHandler } from '#shared/domain/bus/query.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { GetLmsCourseContentQuery } from '#/lms-wrapper/application/get-lms-course-content/get-lms-course-content.query';
import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';

export class GetLmsCourseContentHandler implements QueryHandler {
  constructor(
    private subjectGetter: SubjectGetter,
    private readonly lmsCourseRepository: LmsCourseRepository,
  ) {}

  async handle(query: GetLmsCourseContentQuery): Promise<LmsModuleContent> {
    const subject = await this.subjectGetter.get(query.id);

    return await this.lmsCourseRepository.getContent(
      subject.lmsCourse!.value.id,
      query.resourcesId,
    );
  }
}
