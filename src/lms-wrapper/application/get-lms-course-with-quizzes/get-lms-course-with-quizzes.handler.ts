import { QueryHandler } from '#shared/domain/bus/query.handler';
import { LmsCourseRepository } from '#lms-wrapper/domain/repository/lms-course.repository';
import { GetLmsCourseWithQuizzesQuery } from '#lms-wrapper/application/get-lms-course-with-quizzes/get-lms-course-with-quizzes.query';
import { LmsCourse } from '#lms-wrapper/domain/entity/lms-course';

export class GetLmsCourseWithQuizzesHandler implements QueryHandler {
  constructor(private readonly lmsCourseRepository: LmsCourseRepository) {}

  async handle(query: GetLmsCourseWithQuizzesQuery): Promise<LmsCourse> {
    return await this.lmsCourseRepository.getCourse(
      query.courseId,
      query.studentId,
      query.isSpeciality,
    );
  }
}
