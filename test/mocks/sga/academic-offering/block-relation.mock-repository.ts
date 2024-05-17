import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';

export class BlockRelationMockRepository implements BlockRelationRepository {
  save = jest.fn();
  get = jest.fn();
  delete = jest.fn();
  getByPeriodBlock = jest.fn();
  getByProgramBlock = jest.fn();
  getByProgramBlockAndAcademicPeriod = jest.fn();
}
