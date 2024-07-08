import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetLMSCourseQuery } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.query';

export class GetLmsCourseHandler implements QueryHandler {
  constructor(private readonly lmsCourseRepository: LmsCourseRepository) {}

  async handle(query: GetLMSCourseQuery): Promise<LmsCourse> {
    return await this.lmsCourseRepository.getOne(query.id);
  }
}
