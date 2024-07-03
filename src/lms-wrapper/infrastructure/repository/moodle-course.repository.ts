import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';

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

  async getContent(id: number, contentId: number): Promise<LmsModuleContent> {
    return this.moodleWrapper.getCourseContent(id, contentId);
  }

  async getByName(name: string): Promise<LmsCourse> {
    return this.moodleWrapper.getByName(name);
  }

  async delete(lmsCourse: LmsCourse): Promise<void> {
    await this.moodleWrapper.deleteCourse(lmsCourse);
  }
}
