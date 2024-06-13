import { SubjectUpToBlockGetter } from '#academic-offering/domain/service/subject/subject-up-to-block-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import {
  getAnAcademicProgram,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import {
  getAnAcademicProgramGetterMock,
  getAProgramBlockGetterMock,
} from '#test/service-factory';

let service: SubjectUpToBlockGetter;
let academicProgramGetter: AcademicProgramGetter;
let programBlockGetter: ProgramBlockGetter;

let getProgramBlockSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;

const programBlock = getAProgramBlock();
const subject = getASubject();
const academicProgram = getAnAcademicProgram();
academicProgram.programBlocks = [programBlock];
programBlock.subjects = [subject];

describe('Subject Up To Block Getter', () => {
  beforeAll(() => {
    programBlockGetter = getAProgramBlockGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    getProgramBlockSpy = jest.spyOn(programBlockGetter, 'get');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'get');

    service = new SubjectUpToBlockGetter(
      academicProgramGetter,
      programBlockGetter,
    );
  });

  it('Should return a list of subjects up to a block', async () => {
    getProgramBlockSpy.mockImplementation(() => Promise.resolve(programBlock));
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    const result = await service.getSubjectsUpToBlock(programBlock.id);

    expect(result).toEqual([subject]);
  });
});
