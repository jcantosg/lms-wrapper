import { GetStudentsByProgramsAndGroupsHandler } from '#student/application/get-students-by-programs-and-groups/get-students-by-programs-and-groups.handler';
import { GetStudentsByProgramsAndGroupsQuery } from '#student/application/get-students-by-programs-and-groups/get-students-by-programs-and-groups.query';
import {
  getASGAStudent,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnInternalGroup,
  getAPeriodBlock,
  getASubject,
  getAnAdminUser,
} from '#test/entity-factory';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';

let handler: GetStudentsByProgramsAndGroupsHandler;
let studentRepository: StudentMockRepository;
let getByProgramsAndGroupsSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
const student1 = getASGAStudent();
const student2 = getASGAStudent();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  getAPeriodBlock(),
  getASubject(),
);
const query = new GetStudentsByProgramsAndGroupsQuery(
  [academicProgram.id],
  [internalGroup.id],
  adminUser,
);

describe('Get Students By BU Periods And Programs Handler Test', () => {
  beforeAll(() => {
    studentRepository = new StudentMockRepository();
    handler = new GetStudentsByProgramsAndGroupsHandler(
      studentRepository as any,
    );
    getByProgramsAndGroupsSpy = jest.spyOn(
      studentRepository,
      'getByProgramsAndGroups',
    );
  });

  it('should return unique students', async () => {
    getByProgramsAndGroupsSpy.mockResolvedValue([student1, student2, student1]);

    const result = await handler.handle(query);

    expect(result.map((student) => student.id)).toEqual([
      student1.id,
      student2.id,
    ]);
    expect(new Set(result).size).toBe(result.length);
  });

  it('should return an empty array if no students found', async () => {
    getByProgramsAndGroupsSpy.mockResolvedValue([]);

    const result = await handler.handle(query);

    expect(result).toEqual([]);
  });

  it('should handle errors thrown by the repository', async () => {
    getByProgramsAndGroupsSpy.mockImplementation(() => {
      throw new Error('Some error');
    });

    await expect(handler.handle(query)).rejects.toThrow('Some error');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
