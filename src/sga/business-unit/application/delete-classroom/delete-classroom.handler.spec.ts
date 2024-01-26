import { DeleteClassroomHandler } from '#business-unit/application/delete-classroom/delete-classroom.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { getAClassroom } from '#test/entity-factory';
import { DeleteClassroomCommand } from '#business-unit/application/delete-classroom/delete-classroom.command';
import { ClassroomMockRepository } from '#test/mocks/sga/business-unit/classroom.mock-repository';
import { getAClassroomGetterMock } from '#test/service-factory';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ClassroomNotFoundException } from '#shared/domain/exception/business-unit/classroom-not-found.exception';

let handler: DeleteClassroomHandler;
let classroomRepository: ClassroomRepository;
let classroomGetter: ClassroomGetter;
let deleteSpy: any;
let getClassroomSpy: any;

const classroom = getAClassroom();
const command = new DeleteClassroomCommand(classroom.id, ['businessUnitId']);

describe('Delete classroom handler', () => {
  beforeAll(() => {
    classroomRepository = new ClassroomMockRepository();
    classroomGetter = getAClassroomGetterMock();
    handler = new DeleteClassroomHandler(classroomRepository, classroomGetter);
    deleteSpy = jest.spyOn(classroomRepository, 'delete');
    getClassroomSpy = jest.spyOn(classroomGetter, 'get');
  });
  it('should delete a classroom', async () => {
    getClassroomSpy.mockImplementation((): Promise<Classroom> => {
      return Promise.resolve(classroom);
    });
    await handler.handle(command);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: classroom.id,
        _name: classroom.name,
        _code: classroom.code,
        _capacity: classroom.capacity,
      }),
    );
  });
  it('should throw a classroom not found exception', async () => {
    getClassroomSpy.mockImplementation((): Promise<Classroom> => {
      throw new ClassroomNotFoundException();
    });
    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(ClassroomNotFoundException);
  });
});
