import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';

export class LmsCourseMockRepository implements LmsCourseRepository {
  getOne = jest.fn();
  getAll = jest.fn();
  save = jest.fn();
  getContent = jest.fn();
  getByName = jest.fn();
  getCourseProgress = jest.fn();
  delete = jest.fn();
  updateCourseModuleStatus = jest.fn();
}
