import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { getAnAcademicProgram } from '#test/entity-factory';
import { getAnAcademicProgramGetterMock } from '#test/service-factory';
import { GetAcademicProgramQuery } from '#academic-offering/applicaton/academic-program/get-academic-program/get-academic-program.query';
import { GetAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/get-academic-program/get-academic-program.handler';

let handler: GetAcademicProgramHandler;
let academicProgramGetter: AcademicProgramGetter;
let getSpy: any;

const academicProgram = getAnAcademicProgram();
const query = new GetAcademicProgramQuery(
  academicProgram.id,
  ['businessUnitId'],
  true,
);

describe('Get Academic Program Handler', () => {
  beforeAll(() => {
    academicProgramGetter = getAnAcademicProgramGetterMock();
    handler = new GetAcademicProgramHandler(academicProgramGetter);
    getSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
  });

  it('should return a academicProgram', async () => {
    getSpy.mockImplementation((): Promise<AcademicProgram> => {
      return Promise.resolve(academicProgram);
    });
    const newAcademicProgram = await handler.handle(query);
    expect(newAcademicProgram).toEqual(academicProgram);
  });

  it('should throw an AcademicProgramNotFoundException', async () => {
    getSpy.mockImplementation(() => {
      throw new AcademicProgramNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });
});
