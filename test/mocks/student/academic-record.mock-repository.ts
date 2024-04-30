import { AcademicRecordRepository } from '#/student/domain/repository/academic-record.repository';

export class AcademicRecordMockRepository implements AcademicRecordRepository {
  save = jest.fn();
  get = jest.fn();
  existsById = jest.fn();
}