import { GetStudentHandler } from '#student/application/get-student/get-student.handler';
import { StudentGetter } from '#student/domain/service/student-getter.service';
import { getASGAStudent } from '#test/entity-factory';
import { GetStudentQuery } from '#student/application/get-student/get-student.query';
import { getAStudentGetterMock } from '#test/service-factory';
import { Student } from '#student/domain/entity/student.entity';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';

let handler: GetStudentHandler;
let studentGetter: StudentGetter;
let getStudentSpy: jest.SpyInstance;
const student = getASGAStudent();
const query = new GetStudentQuery(student.id);

describe('Get Student Handler Test', () => {
  beforeAll(() => {
    studentGetter = getAStudentGetterMock();
    handler = new GetStudentHandler(studentGetter);
    getStudentSpy = jest.spyOn(studentGetter, 'get');
  });
  it('should get a student', async () => {
    getStudentSpy.mockImplementation(
      (): Promise<Student> => Promise.resolve(student),
    );
    const getStudent = await handler.handle(query);
    expect(getStudent).toEqual(student);
  });
  it('should throw a StudentNotFoundException', () => {
    getStudentSpy.mockImplementation(() => {
      throw new StudentNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(StudentNotFoundException);
  });
});
