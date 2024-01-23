import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { getAClassroom } from '#test/entity-factory';
import { ClassroomMockRepository } from '#test/mocks/sga/business-unit/classroom.mock-repository';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ClassroomNotFoundException } from '#shared/domain/exception/business-unit/classroom-not-found.exception';

let classroomRepository: ClassroomRepository;
let service: ClassroomGetter;
let getSpy: any;
const classroom = getAClassroom();

describe('Classroom getter service', () => {
  beforeAll(() => {
    classroomRepository = new ClassroomMockRepository();
    getSpy = jest.spyOn(classroomRepository, 'get');
    service = new ClassroomGetter(classroomRepository);
  });
  it('should return a classroom', async () => {
    getSpy.mockImplementation((): Promise<Classroom> => {
      return Promise.resolve(classroom);
    });
    const getClassroom = await service.get(classroom.id);
    expect(getClassroom).toEqual(classroom);
  });
  it('should throw a ClassRoomNotFoundException', async () => {
    getSpy.mockImplementation((): Promise<Classroom | null> => {
      return Promise.resolve(null);
    });
    await expect(service.get(classroom.id)).rejects.toThrow(
      ClassroomNotFoundException,
    );
  });
});
