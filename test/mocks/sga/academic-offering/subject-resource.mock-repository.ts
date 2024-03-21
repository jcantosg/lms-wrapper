import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';

export class SubjectResourceMockRepository
  implements SubjectResourceRepository
{
  save = jest.fn();
  existsById = jest.fn();
  get = jest.fn();
  delete = jest.fn();
}
