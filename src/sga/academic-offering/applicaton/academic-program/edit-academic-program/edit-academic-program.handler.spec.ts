import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import {
  getABusinessUnit,
  getAnAcademicProgram,
  getAnAdminUser,
  getATitle,
} from '#test/entity-factory';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';
import {
  getAnAcademicProgramGetterMock,
  getATitleGetterMock,
} from '#test/service-factory';
import { AcademicProgramDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-program.duplicated-code.exception';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';
import { EditAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/edit-academic-program/edit-academic-program.command';
import { EditAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/edit-academic-program/edit-academic-program.handler';

let handler: EditAcademicProgramHandler;
let repository: AcademicProgramRepository;
let academicProgramGetter: AcademicProgramGetter;
let titleGetter: TitleGetter;

let updateSpy: jest.SpyInstance;
let existsSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getTitleSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const academicProgram = getAnAcademicProgram();
const title = getATitle();

const command = new EditAcademicProgramCommand(
  'id',
  'name',
  'officialCode',
  'title',
  getAnAdminUser(),
);

describe('Edit Academic Program Handler', () => {
  beforeAll(() => {
    repository = new AcademicProgramMockRepository();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    titleGetter = getATitleGetterMock();
    handler = new EditAcademicProgramHandler(
      repository,
      academicProgramGetter,
      titleGetter,
    );
    updateSpy = jest.spyOn(repository, 'save');
    existsSpy = jest.spyOn(repository, 'existsByCode');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    getTitleSpy = jest.spyOn(titleGetter, 'getByAdminUser');
  });

  it('should throw a 409 duplicated code error', async () => {
    existsSpy.mockImplementation((): Promise<boolean> => Promise.resolve(true));
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramDuplicatedCodeException,
    );
  });

  it('should throw a 404 title not found error', async () => {
    existsSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(false),
    );
    getAcademicProgramSpy.mockImplementation(
      (): Promise<any> => Promise.resolve(academicProgram),
    );
    getTitleSpy.mockImplementation((): Promise<any> => Promise.resolve(title));

    await expect(handler.handle(command)).rejects.toThrow(
      TitleNotFoundException,
    );
  });

  it('should update an academic program', async () => {
    existsSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(false),
    );
    getAcademicProgramSpy.mockImplementation(
      (): Promise<any> => Promise.resolve(academicProgram),
    );
    getTitleSpy.mockImplementation((): Promise<any> => Promise.resolve(title));

    title.businessUnit = businessUnit;
    academicProgram.businessUnit = businessUnit;

    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _name: 'name',
        _code: 'officialCode',
        _title: title,
      }),
    );
  });
});
