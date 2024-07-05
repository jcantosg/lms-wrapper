import {
  getAProgramBlock,
  getASubject,
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnAdminUser,
} from '#test/entity-factory';
import clearAllMocks = jest.clearAllMocks;
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';

let service: EnrollmentCreator;
let subjectRepository: SubjectRepository;
let uuidGenerator: UUIDGeneratorService;
let getSubjectsSpy: jest.SpyInstance;

const programBlock = getAProgramBlock();
const academicProgram = getAnAcademicProgram();
programBlock.academicProgram = academicProgram;
const academicRecord = getAnAcademicRecord();
academicRecord.academicProgram = academicProgram;
const subjects = [getASubject(), getASubject(), getASubject()];
subjects.forEach((subject) => (subject.programBlocks = [programBlock]));

const subjectNotFound = getASubject();

const adminUser = getAnAdminUser();

describe('Enrollment Creator Service Unit Test', () => {
  beforeAll(() => {
    subjectRepository = new SubjectMockRepository();
    uuidGenerator = new UUIDv4GeneratorService();
    service = new EnrollmentCreator(subjectRepository, uuidGenerator);
    getSubjectsSpy = jest.spyOn(
      subjectRepository,
      'getSubjectsByAcademicProgram',
    );
  });

  it('should return three enrollment', async () => {
    getSubjectsSpy.mockImplementation(() => Promise.resolve(subjects));

    const response = await service.createForAcademicRecord(
      academicRecord,
      adminUser,
    );
    expect(response.length).toBe(3);
  });

  it('should throw an ProgramBlockNotFoundException', () => {
    getSubjectsSpy.mockImplementation(() => Promise.resolve([subjectNotFound]));

    expect(
      service.createForAcademicRecord(academicRecord, adminUser),
    ).rejects.toThrow(ProgramBlockNotFoundException);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
