import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';
import { LmsStudent } from '#lms-wrapper/domain/entity/lms-student';

export class MoodleCourseRepository implements LmsCourseRepository {
  constructor(private readonly moodleWrapper: MoodleWrapper) {}

  async getOne(id: number, isSpeciality: boolean): Promise<LmsCourse> {
    return await this.moodleWrapper.getCourse(id, isSpeciality);
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
    student: LmsStudent,
    isSpeciality: boolean = false,
  ): Promise<LmsModuleContent> {
    return this.moodleWrapper.getCourseContent(
      id,
      contentId,
      student,
      isSpeciality,
    );
  }

  async getByName(
    name: string,
    isSpeciality: boolean,
  ): Promise<LmsCourse | null> {
    return this.moodleWrapper.getByName(name, isSpeciality);
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

  async getCourse(
    id: number,
    studentId: number,
    isSpeciality: boolean,
  ): Promise<LmsCourse> {
    return this.moodleWrapper.getCourseWithQuizzes(id, studentId, isSpeciality);
  }
}
