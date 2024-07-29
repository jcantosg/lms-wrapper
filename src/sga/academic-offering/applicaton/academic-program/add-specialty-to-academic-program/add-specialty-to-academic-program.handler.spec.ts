import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getABusinessUnit,
  getAnAcademicProgram,
  getAnAdminUser,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import {
  getAnAcademicProgramGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { AddSpecialtyToAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/add-specialty-to-academic-program/add-specialty-to-academic-program.handler';
import { AddSpecialtyToAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/add-specialty-to-academic-program/add-specialty-to-academic-program.command';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { InvalidSubjectTypeException } from '#shared/domain/exception/academic-offering/subject.invalid-type.exception';
import { AcademicProgramMisMatchBusinessUnitException } from '#shared/domain/exception/academic-offering/academic-program.missmatch-business-unit.exception';

let handler: AddSpecialtyToAcademicProgramHandler;
let repository: ProgramBlockRepository;
let academicProgramGetter: AcademicProgramGetter;
let subjectGetter: SubjectGetter;

let saveSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let getProgramBlockSpy: jest.SpyInstance;

const academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
const businessUnit = getABusinessUnit();
const subject = getASubject();
const specialty = getASubject();
const wrongSpecialty = getASubject();
wrongSpecialty.type = SubjectType.SPECIALTY;
specialty.type = SubjectType.SPECIALTY;
specialty.businessUnit = businessUnit;
academicProgram.businessUnit = businessUnit;
academicProgram.addProgramBlock(programBlock);

const command = new AddSpecialtyToAcademicProgramCommand(
  subject.id,
  programBlock.academicProgram.id,
  getAnAdminUser(),
);

describe('Add Specialty to Academic Program Handler', () => {
  beforeAll(async () => {
    repository = new ProgramBlockMockRepository();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    subjectGetter = getASubjectGetterMock();
    handler = new AddSpecialtyToAcademicProgramHandler(
      repository,
      academicProgramGetter,
      subjectGetter,
    );

    saveSpy = jest.spyOn(repository, 'save');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getProgramBlockSpy = jest.spyOn(repository, 'getFirstBlockByProgram');
  });

  it('should throw a AcademicProgramNotFoundException', () => {
    getAcademicProgramSpy.mockImplementation(() => {
      throw new AcademicProgramNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should throw a SubjectNotFoundException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });

    expect(handler.handle(command)).rejects.toThrow(SubjectNotFoundException);
  });

  it('should throw a InvalidSubjectTypeException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    expect(handler.handle(command)).rejects.toThrow(
      InvalidSubjectTypeException,
    );
  });

  it('should throw a AcademicProgramMisMatchBusinessUnitException', () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(wrongSpecialty));
    expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramMisMatchBusinessUnitException,
    );
  });

  it('should add a subject to a program block', async () => {
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(specialty));
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: programBlock.id,
        subjects: expect.arrayContaining([specialty]),
      }),
    );
  });
});
