import { GetSubjectsByProgramBlockHandler } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.handler';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { GetSubjectsByProgramBlockQuery } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.query';
import {
  getAnAdminUser,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { getAProgramBlockGetterMock } from '#test/service-factory';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import clearAllMocks = jest.clearAllMocks;
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

let handler: GetSubjectsByProgramBlockHandler;
let programBlockGetter: ProgramBlockGetter;
let subjectRepository: SubjectRepository;

let getByAdminUserSpy: jest.SpyInstance;
let getSubjectsSpy: jest.SpyInstance;

const programBlock = getAProgramBlock();
const subjects = [getASubject()];
programBlock.subjects = [getASubject(), getASubject()];
const query = new GetSubjectsByProgramBlockQuery(
  programBlock.id,
  getAnAdminUser(),
  OrderTypes.NONE,
  '',
);

describe('Get Subjects By Program Block Handler', () => {
  beforeAll(async () => {
    programBlockGetter = getAProgramBlockGetterMock();
    subjectRepository = new SubjectMockRepository();
    handler = new GetSubjectsByProgramBlockHandler(
      programBlockGetter,
      subjectRepository,
    );
    getByAdminUserSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
    getSubjectsSpy = jest.spyOn(subjectRepository, 'matching');
  });
  it('should return a list of subjects', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<ProgramBlock> => Promise.resolve(programBlock),
    );
    getSubjectsSpy.mockImplementation(
      (): Promise<Subject[]> => Promise.resolve(subjects),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(subjects);
  });
  it('should return a ProgramBlockNotFoundException', () => {
    getByAdminUserSpy.mockImplementation((): Promise<ProgramBlock> => {
      throw new ProgramBlockNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(
      ProgramBlockNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
