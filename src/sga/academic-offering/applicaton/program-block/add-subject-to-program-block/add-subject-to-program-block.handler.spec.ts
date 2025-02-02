import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import {
  getAProgramBlockGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { AddSubjectToProgramBlockHandler } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.handler';
import { AddSubjectToProgramBlockCommand } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.command';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';

let handler: AddSubjectToProgramBlockHandler;
let repository: ProgramBlockRepository;
let subjectRepository: SubjectRepository;
let programBlockGetter: ProgramBlockGetter;
let subjectGetter: SubjectGetter;

let saveSpy: jest.SpyInstance;
let getProgramBlockSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let getSubjectsByAcademicProgram: jest.SpyInstance;

const programBlock = getAProgramBlock();
const businessUnit = getABusinessUnit();
const subject = getASubject();
subject.businessUnit = businessUnit;
programBlock.academicProgram.businessUnit = businessUnit;
const command = new AddSubjectToProgramBlockCommand(
  subject.id,
  programBlock.id,
  getAnAdminUser(),
);
describe('Add Subject to Program Block Handler', () => {
  beforeAll(async () => {
    repository = new ProgramBlockMockRepository();
    subjectRepository = new SubjectMockRepository();
    programBlockGetter = getAProgramBlockGetterMock();
    subjectGetter = getASubjectGetterMock();
    handler = new AddSubjectToProgramBlockHandler(
      repository,
      subjectRepository,
      programBlockGetter,
      subjectGetter,
    );
    saveSpy = jest.spyOn(repository, 'save');
    getProgramBlockSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getSubjectsByAcademicProgram = jest.spyOn(
      subjectRepository,
      'getSubjectsByAcademicProgram',
    );
  });

  it('should add a subject to a program block', async () => {
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getSubjectsByAcademicProgram.mockImplementation(() => Promise.resolve([]));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: programBlock.id,
        subjects: expect.arrayContaining([subject]),
      }),
    );
  });

  it('should throw a ProgramBlockNotFoundException', () => {
    getProgramBlockSpy.mockImplementation(() => {
      throw new ProgramBlockNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(
      ProgramBlockNotFoundException,
    );
  });

  it('should throw a ProgramBlockNotFoundException', () => {
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(SubjectNotFoundException);
  });
});
