import { MoveSubjectFromProgramBlockHandler } from '#academic-offering/applicaton/program-block/move-subject-from-program-block/move-subject-from-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { MoveSubjectFromProgramBlockCommand } from '#academic-offering/applicaton/program-block/move-subject-from-program-block/move-subject-from-program-block.command';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import {
  getAProgramBlockGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import {
  getAnAdminUser,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import clearAllMocks = jest.clearAllMocks;

let handler: MoveSubjectFromProgramBlockHandler;
let repository: ProgramBlockRepository;
let programBlockGetter: ProgramBlockGetter;
let subjectGetter: SubjectGetter;

let moveSubjectsSpy: jest.SpyInstance;
let getProgramBlockSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;

const currentBlock = getAProgramBlock();
const newBlock = getAProgramBlock();
newBlock.academicProgram.id = currentBlock.academicProgram.id;
const subjects = [getASubject(), getASubject()];
currentBlock.subjects = subjects;

const command = new MoveSubjectFromProgramBlockCommand(
  subjects.map((subject) => subject.id),
  newBlock.id,
  getAnAdminUser(),
  currentBlock.id,
);

describe('MoveSubjectHandler Unit Test', () => {
  beforeAll(() => {
    repository = new ProgramBlockMockRepository();
    programBlockGetter = getAProgramBlockGetterMock();
    subjectGetter = getASubjectGetterMock();
    handler = new MoveSubjectFromProgramBlockHandler(
      repository,
      programBlockGetter,
      subjectGetter,
    );
    moveSubjectsSpy = jest.spyOn(repository, 'moveSubjects');
    getProgramBlockSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
  });

  it('should move subjects to a new block', async () => {
    getProgramBlockSpy.mockImplementation((id) =>
      Promise.resolve(id === currentBlock.id ? currentBlock : newBlock),
    );
    getSubjectSpy.mockImplementation((id) =>
      Promise.resolve(subjects.find((subject) => subject.id === id)),
    );

    await handler.handle(command);

    expect(moveSubjectsSpy).toHaveBeenCalledTimes(1);
    expect(moveSubjectsSpy).toHaveBeenCalledWith(
      subjects,
      newBlock,
      currentBlock,
    );
  });

  it('should throw ProgramBlockNotFoundException', async () => {
    newBlock.academicProgram.id = 'differentProgramId';
    getProgramBlockSpy.mockImplementation((id) =>
      Promise.resolve(id === currentBlock.id ? currentBlock : newBlock),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      ProgramBlockNotFoundException,
    );
  });

  it('should throw SubjectNotFoundException', async () => {
    const invalidSubject = getASubject();
    const invalidCommand = new MoveSubjectFromProgramBlockCommand(
      [...subjects.map((subject) => subject.id), invalidSubject.id],
      newBlock.id,
      getAnAdminUser(),
      currentBlock.id,
    );

    newBlock.academicProgram.id = currentBlock.academicProgram.id;

    getProgramBlockSpy.mockImplementation((id) =>
      Promise.resolve(id === currentBlock.id ? currentBlock : newBlock),
    );
    getSubjectSpy.mockImplementation((id) =>
      Promise.resolve(
        subjects.find((subject) => subject.id === id) || invalidSubject,
      ),
    );

    await expect(handler.handle(invalidCommand)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
