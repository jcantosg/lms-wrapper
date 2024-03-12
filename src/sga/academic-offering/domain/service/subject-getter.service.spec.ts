import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import { getASubject } from '#test/entity-factory';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject-not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let service: SubjectGetter;
let repository: SubjectRepository;
const subject = getASubject();
let getSpy: jest.SpyInstance;

describe('Subject Getter Unit Tests', () => {
  beforeAll(() => {
    repository = new SubjectMockRepository();
    service = new SubjectGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
  });

  it('should return a subject', async () => {
    getSpy.mockImplementation((): Promise<Subject | null> => {
      return Promise.resolve(subject);
    });
    const result = await service.get(subject.id);
    expect(result).toEqual(subject);
  });
  it('should throw an exception', async () => {
    getSpy.mockImplementation(
      (): Promise<Subject | null> => Promise.resolve(null),
    );
    await expect(service.get(subject.id)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
