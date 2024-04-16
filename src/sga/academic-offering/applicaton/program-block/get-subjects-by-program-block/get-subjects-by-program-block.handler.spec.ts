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

let handler: GetSubjectsByProgramBlockHandler;
let programBlockGetter: ProgramBlockGetter;

let getByAdminUserSpy: jest.SpyInstance;

const programBlock = getAProgramBlock();
programBlock.subjects = [getASubject(), getASubject()];
const query = new GetSubjectsByProgramBlockQuery(
  programBlock.id,
  getAnAdminUser(),
);

describe('Get Subjects By Program Block Handler', () => {
  beforeAll(async () => {
    programBlockGetter = getAProgramBlockGetterMock();
    handler = new GetSubjectsByProgramBlockHandler(programBlockGetter);
    getByAdminUserSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
  });
  it('should return a list of subjects', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<ProgramBlock> => Promise.resolve(programBlock),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(programBlock.subjects);
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
