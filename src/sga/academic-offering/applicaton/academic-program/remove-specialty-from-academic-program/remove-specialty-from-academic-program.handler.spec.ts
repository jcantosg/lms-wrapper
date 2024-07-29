import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getAnAcademicProgram,
  getAnAdminUser,
  getAnEnrollment,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import {
  getAnAcademicProgramGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { RemoveSpecialtyFromAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/remove-specialty-from-academic-program/remove-specialty-from-academic-program.command';
import { RemoveSpecialtyFromAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/remove-specialty-from-academic-program/remove-specialty-from-academic-program.handler';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { InvalidSubjectTypeException } from '#shared/domain/exception/academic-offering/subject.invalid-type.exception';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { SubjectHasEnrollmentsException } from '#shared/domain/exception/academic-offering/subject.has-enrollments.exception';

let handler: RemoveSpecialtyFromAcademicProgramHandler;
let programBlockRepository: ProgramBlockRepository;
let enrollmentRepository: EnrollmentRepository;
let subjectGetter: SubjectGetter;
let academicProgramGetter: AcademicProgramGetter;

let saveSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let getProgramBlockSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getEnrollmentsSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();

const academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
const subject = getASubject();
const specialty = getASubject();
const enrollment = getAnEnrollment();

specialty.type = SubjectType.SPECIALTY;
programBlock.subjects = [subject, specialty];
academicProgram.programBlocks[0] = programBlock;

const specialtyCommand = new RemoveSpecialtyFromAcademicProgramCommand(
  specialty.id,
  academicProgram.id,
  adminUser,
);

describe('Remove Specialty from Academic Program handler', () => {
  beforeAll(() => {
    programBlockRepository = new ProgramBlockMockRepository();
    enrollmentRepository = new EnrollmentMockRepository();
    subjectGetter = getASubjectGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    handler = new RemoveSpecialtyFromAcademicProgramHandler(
      academicProgramGetter,
      subjectGetter,
      enrollmentRepository,
      programBlockRepository,
    );
    saveSpy = jest.spyOn(programBlockRepository, 'save');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getProgramBlockSpy = jest.spyOn(
      programBlockRepository,
      'getFirstBlockByProgram',
    );
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    getEnrollmentsSpy = jest.spyOn(enrollmentRepository, 'getBySubject');
  });

  it('should throw a AcademicProgramNotFoundException', () => {
    getAcademicProgramSpy.mockImplementation(() => {
      throw new AcademicProgramNotFoundException();
    });
    expect(handler.handle(specialtyCommand)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should throw a ProgramBlockNotFoundException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getProgramBlockSpy.mockImplementation(() => {
      throw new ProgramBlockNotFoundException();
    });
    expect(handler.handle(specialtyCommand)).rejects.toThrow(
      ProgramBlockNotFoundException,
    );
  });

  it('should throw a SubjectNotFoundException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    expect(handler.handle(specialtyCommand)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });

  it('should throw a InvalidSubjectTypeException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    expect(handler.handle(specialtyCommand)).rejects.toThrow(
      InvalidSubjectTypeException,
    );
  });

  it('should throw a SubjectHasEnrollmentsException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getSubjectSpy.mockImplementation(() => Promise.resolve(specialty));
    getEnrollmentsSpy.mockImplementation(() => Promise.resolve([enrollment]));
    expect(handler.handle(specialtyCommand)).rejects.toThrow(
      SubjectHasEnrollmentsException,
    );
  });

  it('should remove a specialty', async () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getSubjectSpy.mockImplementation(() => Promise.resolve(specialty));
    getEnrollmentsSpy.mockImplementation(() => Promise.resolve([]));

    await handler.handle(specialtyCommand);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: programBlock.id,
        subjects: [subject],
      }),
    );
  });
});
