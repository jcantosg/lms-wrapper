import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

export class MoodleCourseRepository implements LmsCourseRepository {
  constructor(private readonly moodleWrapper: MoodleWrapper) {}

  async getOne(id: number): Promise<LmsCourse> {
    return await this.moodleWrapper.getCourse(id);
  }

  async getAll(): Promise<LmsCourse[]> {
    return await this.moodleWrapper.getAllCourses();
  }

  async save(lmsCourse: LmsCourse): Promise<void> {
    await this.moodleWrapper.saveCourse(lmsCourse);
  }
}
