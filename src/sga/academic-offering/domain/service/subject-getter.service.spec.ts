import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { getASubject } from '#test/entity-factory';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';

let service: SubjectGetter;
let subjectRepository: SubjectRepository;

let getSubjectSpy: any;

const subject = getASubject();

describe('Subject Getter', () => {
  beforeAll(() => {
    subjectRepository = new SubjectMockRepository();

    getSubjectSpy = jest.spyOn(subjectRepository, 'get');

    service = new SubjectGetter(subjectRepository);
  });

  it('Should return a subject', async () => {
    getSubjectSpy.mockImplementation((): Promise<Subject | null> => {
      return Promise.resolve(subject);
    });

    const result = await service.get('subjectId');

    expect(result).toBe(subject);
  });

  it('Should throw a SubjectNotFoundException', async () => {
    getSubjectSpy.mockImplementation((): Promise<Subject | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('subjectId')).rejects.toThrow(
      SubjectNotFoundException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
