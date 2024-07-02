import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetLMSCourseByNameQuery } from '#/lms-wrapper/application/get-lms-course-by-name/get-lms-course-by-name.query';

export class GetLmsCourseByNameHandler implements QueryHandler {
  constructor(private readonly lmsCourseRepository: LmsCourseRepository) {}

  async handle(query: GetLMSCourseByNameQuery): Promise<LmsCourse> {
    return await this.lmsCourseRepository.getByName(query.name);
  }
}
