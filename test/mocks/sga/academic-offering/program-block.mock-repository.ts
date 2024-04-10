import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';

export class ProgramBlockMockRepository implements ProgramBlockRepository {
  existsById = jest.fn();
  save = jest.fn();
  get = jest.fn();
  getByAdminUser = jest.fn();
}
