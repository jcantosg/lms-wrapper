import { QueryHandler } from '#shared/domain/bus/query.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { GetLmsCourseProgressQuery } from '#/lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.query';

export class GetLmsCourseProgressHandler implements QueryHandler {
  constructor(private readonly repository: LmsCourseRepository) {}

  async handle(query: GetLmsCourseProgressQuery): Promise<number> {
    return await this.repository.getCourseProgress(
      query.courseId,
      query.studentId,
    );
  }
}
