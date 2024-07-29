import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';

export class AdministrativeGroupMockRepository
  implements AdministrativeGroupRepository
{
  save = jest.fn();
  saveBatch = jest.fn();
  existsById = jest.fn();
  existsByCode = jest.fn();
  count = jest.fn();
  matching = jest.fn();
  getByAdminUser = jest.fn();
  getByAcademicPeriodAndProgramAndBlock = jest.fn();
  getByAcademicProgram = jest.fn();
  getByAcademicPeriodAndProgramAndFirstBlock = jest.fn();
  moveStudents = jest.fn();
  getByStudentAndAcademicPeriodAndAcademicProgram = jest.fn();
  get = jest.fn();
}
