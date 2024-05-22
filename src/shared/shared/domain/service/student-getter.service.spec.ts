import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import { getASGAStudent } from '#test/entity-factory';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';

let service: StudentGetter;
let repository: StudentRepository;
let getSpy: jest.SpyInstance;

const student = getASGAStudent();

describe('Student Getter Service', () => {
  beforeAll(() => {
    repository = new StudentMockRepository();
    service = new StudentGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
  });
  it('should return a student', async () => {
    getSpy.mockImplementation(
      (): Promise<Student | null> => Promise.resolve(student),
    );
    const result = await service.get(student.id);
    expect(result).toEqual(student);
  });
  it('should throw a StudentNotFoundException', async () => {
    getSpy.mockImplementation(
      (): Promise<Student | null> => Promise.resolve(null),
    );
    await expect(service.get(student.id)).rejects.toThrow(
      StudentNotFoundException,
    );
  });
});
