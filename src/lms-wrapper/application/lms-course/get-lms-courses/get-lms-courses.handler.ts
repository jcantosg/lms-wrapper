import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

export class GetLmsCoursesHandler implements QueryEmptyHandler {
  constructor(private readonly lmsCourseRepository: LmsCourseRepository) {}

  async handle(): Promise<LmsCourse[]> {
    return await this.lmsCourseRepository.getAll();
  }
}
