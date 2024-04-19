import { RemoveSubjectFromProgramBlockHandler } from '#academic-offering/applicaton/program-block/remove-subject-from-program-block/remove-subject-from-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getAnAdminUser,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { RemoveSubjectFromProgramBlockCommand } from '#academic-offering/applicaton/program-block/remove-subject-from-program-block/remove-subject-from-program-block.command';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import {
  getAProgramBlockGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';

let handler: RemoveSubjectFromProgramBlockHandler;
let repository: ProgramBlockRepository;
let programBlockGetter: ProgramBlockGetter;
let subjectGetter: SubjectGetter;

let saveSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let getProgramBlockSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();

const programBlock = getAProgramBlock();
const firstSubject = getASubject();
const secondSubject = getASubject();
programBlock.subjects = [...programBlock.subjects, firstSubject, secondSubject];
const command = new RemoveSubjectFromProgramBlockCommand(
  [programBlock.subjects[0].id],
  programBlock.id,
  adminUser,
);

describe('Remove Subjects from Program Block handler', () => {
  beforeAll(() => {
    repository = new ProgramBlockMockRepository();
    subjectGetter = getASubjectGetterMock();
    programBlockGetter = getAProgramBlockGetterMock();
    handler = new RemoveSubjectFromProgramBlockHandler(
      repository,
      subjectGetter,
      programBlockGetter,
    );
    saveSpy = jest.spyOn(repository, 'save');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getProgramBlockSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
  });
  it('should remove a subject', async () => {
    getSubjectSpy.mockImplementation(() => firstSubject);
    getProgramBlockSpy.mockImplementation(() => programBlock);
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: programBlock.id,
        subjects: [secondSubject],
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
  it('should throw a SubjectNotFoundException', () => {
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    getProgramBlockSpy.mockImplementation(() => programBlock);
    expect(handler.handle(command)).rejects.toThrow(SubjectNotFoundException);
  });
});
