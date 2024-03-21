import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject-resource-getter.service';
import { SubjectResourceNotFoundException } from '#shared/domain/exception/academic-offering/subject-resource.not-found.exception';
import { getASubjectResource } from '#test/entity-factory';
import { SubjectResourceMockRepository } from '#test/mocks/sga/academic-offering/subject-resource.mock-repository';

let service: SubjectResourceGetter;
let subjectRepository: SubjectResourceRepository;

let getSubjectResourceSpy: any;

const subjectResource = getASubjectResource();

describe('SubjectResource Getter', () => {
  beforeAll(() => {
    subjectRepository = new SubjectResourceMockRepository();

    getSubjectResourceSpy = jest.spyOn(subjectRepository, 'get');

    service = new SubjectResourceGetter(subjectRepository);
  });

  it('Should return a subject resource', async () => {
    getSubjectResourceSpy.mockImplementation(
      (): Promise<SubjectResource | null> => {
        return Promise.resolve(subjectResource);
      },
    );

    const result = await service.get('subjectResourceId');

    expect(result).toBe(subjectResource);
  });

  it('Should throw a SubjectResourceNotFoundException', async () => {
    getSubjectResourceSpy.mockImplementation(
      (): Promise<SubjectResource | null> => {
        return Promise.resolve(null);
      },
    );

    await expect(service.get('subjectResourceId')).rejects.toThrow(
      SubjectResourceNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
