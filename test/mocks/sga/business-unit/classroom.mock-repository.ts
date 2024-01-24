import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';

export class ClassroomMockRepository implements ClassroomRepository {
  get = jest.fn();
  save = jest.fn();
  existsByNameAndExaminationCenter = jest.fn();
  existsByCode = jest.fn();
  existsById = jest.fn();
  delete = jest.fn();
}
