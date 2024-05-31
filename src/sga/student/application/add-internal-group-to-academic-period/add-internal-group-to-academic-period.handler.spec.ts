import { v4 as uuid } from 'uuid';
import {
  getABlockRelation,
  getAPeriodBlock,
  getAProgramBlock,
  getASubject,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAnEdaeUser,
  getAnInternalGroup,
} from '#test/entity-factory';
import clearAllMocks = jest.clearAllMocks;
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import {
  getASubjectGetterMock,
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { BlockRelationMockRepository } from '#test/mocks/sga/academic-offering/block-relation.mock-repository';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AddInternalGroupToAcademicPeriodHandler } from '#student/application/add-internal-group-to-academic-period/add-internal-group-to-academic-period.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { AddInternalGroupToAcademicPeriodCommand } from '#student/application/add-internal-group-to-academic-period/add-internal-group-to-academic-period.command';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { BlockRelationNotFoundException } from '#shared/domain/exception/academic-offering/block-relation.not-found.exception';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';

let handler: AddInternalGroupToAcademicPeriodHandler;
let repository: InternalGroupRepository;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;
let subjectGetter: SubjectGetter;
let blockRelationRepository: BlockRelationRepository;
let edaeUserGetter: EdaeUserGetter;

let saveSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let getBlockRelationSpy: jest.SpyInstance;
let getInternalGroupsByKeysSpy: jest.SpyInstance;
let getEdaeUserSpy: jest.SpyInstance;

const edaeUser = getAnEdaeUser();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const subject = getASubject();
const anotherSubject = getASubject();
const anotherAcademicProgram = getAnAcademicProgram();
const adminUser = getAnAdminUser();
const programBlock = getAProgramBlock(uuid(), academicProgram);
programBlock.addSubject(subject, adminUser);
const periodBlock = getAPeriodBlock(
  new Date(),
  new Date(),
  uuid(),
  academicPeriod,
);
const blockRelation = getABlockRelation(periodBlock, programBlock);

academicPeriod.academicPrograms = [academicProgram];
academicProgram.academicPeriods = [academicPeriod];
academicProgram.programBlocks = [programBlock];
programBlock.subjects = [subject];

const command = new AddInternalGroupToAcademicPeriodCommand(
  uuid(),
  academicPeriod.id,
  'prefix',
  'sufix',
  academicProgram.id,
  subject.id,
  [edaeUser.id],
  true,
  adminUser,
);

describe('Add internal group to academic period Handler Test', () => {
  beforeAll(() => {
    repository = new InternalGroupMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    subjectGetter = getASubjectGetterMock();
    blockRelationRepository = new BlockRelationMockRepository();
    edaeUserGetter = getEdaeUserGetterMock();
    handler = new AddInternalGroupToAcademicPeriodHandler(
      repository,
      academicPeriodGetter,
      subjectGetter,
      academicProgramGetter,
      blockRelationRepository,
      edaeUserGetter,
    );
    saveSpy = jest.spyOn(repository, 'save');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getBlockRelationSpy = jest.spyOn(
      blockRelationRepository,
      'getByProgramBlockAndAcademicPeriod',
    );
    getInternalGroupsByKeysSpy = jest.spyOn(repository, 'getByKeys');
    getEdaeUserSpy = jest.spyOn(edaeUserGetter, 'getByAdminUser');
  });

  it('should throw an AcademicPeriodNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation(() => {
      throw new AcademicPeriodNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  it('should throw an AcademicProgramNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() => {
      throw new AcademicProgramNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should throw a SubjectNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });

  it('should throw an AcademicProgramNotFoundException because academicProgran not linked to academicPeriod', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(anotherAcademicProgram),
    );
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should throw an ProgramBlockNotFoundException because there is no programblock with this subject', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(anotherSubject));

    await expect(handler.handle(command)).rejects.toThrow(
      ProgramBlockNotFoundException,
    );
  });

  it('should throw an BlockRelationNotFoundException because there is no relation', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getBlockRelationSpy.mockImplementation(() => Promise.resolve(null));

    await expect(handler.handle(command)).rejects.toThrow(
      BlockRelationNotFoundException,
    );
  });

  it('should throw an EdeUserNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getBlockRelationSpy.mockImplementation(() =>
      Promise.resolve(blockRelation),
    );

    getEdaeUserSpy.mockImplementation(() => {
      throw new EdaeUserNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      EdaeUserNotFoundException,
    );
  });

  it('should create an internalGroup with code zero', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getBlockRelationSpy.mockImplementation(() =>
      Promise.resolve(blockRelation),
    );

    getEdaeUserSpy.mockImplementation(() => Promise.resolve(edaeUser));
    getInternalGroupsByKeysSpy.mockImplementation(() => Promise.resolve([]));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        code: `${command.prefix}${academicProgram.code}${subject.code}${academicPeriod.code}0${command.sufix}`,
      }),
    );
  });

  it('should create an internalGroup with code one', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getBlockRelationSpy.mockImplementation(() =>
      Promise.resolve(blockRelation),
    );
    getEdaeUserSpy.mockImplementation(() => Promise.resolve(edaeUser));
    getInternalGroupsByKeysSpy.mockImplementation(() =>
      Promise.resolve([
        getAnInternalGroup(
          academicPeriod,
          academicProgram,
          periodBlock,
          subject,
        ),
      ]),
    );

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
