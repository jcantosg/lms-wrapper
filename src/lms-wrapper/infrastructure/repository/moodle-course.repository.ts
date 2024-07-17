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

  async getContent(
    id: number,
    contentId: number,
    studentId: number,
  ): Promise<LmsModuleContent> {
    return this.moodleWrapper.getCourseContent(id, contentId, studentId);
  }

  async getByName(name: string): Promise<LmsCourse | null> {
    return this.moodleWrapper.getByName(name);
  }

  async getCourseProgress(
    courseId: number,
    studentId: number,
  ): Promise<number> {
    return this.moodleWrapper.getCourseProgress(courseId, studentId);
  }

  async delete(lmsCourse: LmsCourse): Promise<void> {
    await this.moodleWrapper.deleteCourse(lmsCourse);
  }

  async updateCourseModuleStatus(
    courseModuleId: number,
    studentId: number,
    newStatus: number,
  ): Promise<void> {
    await this.moodleWrapper.updateCourseCompletionStatus(
      courseModuleId,
      studentId,
      newStatus,
    );
  }
}
