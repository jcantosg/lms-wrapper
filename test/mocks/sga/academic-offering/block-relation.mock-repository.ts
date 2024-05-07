import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';

export class BlockRelationMockRepository implements BlockRelationRepository {
  getByProgramBlock = jest.fn();
  save = jest.fn();
  get = jest.fn();
  getByPeriodBlock = jest.fn();
  delete = jest.fn();
}
