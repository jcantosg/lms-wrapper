import { GetStudentsByBuPeriodsAndProgramsHandler } from '#student/application/get-students-by-bu-periods-and-programs/get-students-by-bu-periods-and-programs.handler';
import { GetStudentsByBuPeriodsAndProgramsQuery } from '#student/application/get-students-by-bu-periods-and-programs/get-students-by-bu-periods-and-programs.query';
import {
  getASGAStudent,
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAcademicProgram,
} from '#test/entity-factory';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';

let handler: GetStudentsByBuPeriodsAndProgramsHandler;
let studentRepository: StudentMockRepository;
let findByBuPeriodsAndProgramsSpy: jest.SpyInstance;

const student1 = getASGAStudent();
const student2 = getASGAStudent();
const businessUnit = getABusinessUnit();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const query = new GetStudentsByBuPeriodsAndProgramsQuery(
  [businessUnit.id],
  [academicPeriod.id],
  [academicProgram.id],
  [businessUnit.id],
);

describe('Get Students By BU Periods And Programs Handler Test', () => {
  beforeAll(() => {
    studentRepository = new StudentMockRepository();
    handler = new GetStudentsByBuPeriodsAndProgramsHandler(
      studentRepository as any,
    );
    findByBuPeriodsAndProgramsSpy = jest.spyOn(
      studentRepository,
      'findByBuPeriodsAndPrograms',
    );
  });

  it('should return unique students', async () => {
    findByBuPeriodsAndProgramsSpy.mockResolvedValue([
      student1,
      student2,
      student1,
    ]);

    const result = await handler.handle(query);

    expect(result).toEqual([student1, student2]);
    expect(new Set(result).size).toBe(result.length);
  });

  it('should return an empty array if no students found', async () => {
    findByBuPeriodsAndProgramsSpy.mockResolvedValue([]);

    const result = await handler.handle(query);

    expect(result).toEqual([]);
  });

  it('should handle errors thrown by the repository', async () => {
    findByBuPeriodsAndProgramsSpy.mockImplementation(() => {
      throw new Error('Some error');
    });

    await expect(handler.handle(query)).rejects.toThrow('Some error');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
