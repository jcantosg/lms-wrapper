import { EditAcademicRecordHandler } from '#student/application/academic-record/edit-academic-record/edit-academic-record.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { EditAcademicRecordCommand } from '#student/application/academic-record/edit-academic-record/edit-academic-record.command';
import { getAnAcademicRecord, getAnAdminUser } from '#test/entity-factory';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';
import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

let handler: EditAcademicRecordHandler;
let repository: AcademicRecordRepository;
let academicRecordGetter: AcademicRecordGetter;

let getByAdminUserSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
const academicRecord = getAnAcademicRecord();

const command = new EditAcademicRecordCommand(
  'ca9aa9b2-fc51-4cac-bc94-211efb91b96c',
  AcademicRecordStatusEnum.VALID,
  AcademicRecordModalityEnum.ELEARNING,
  false,
  adminUser,
);

describe('Edit Academic Record Handler', () => {
  beforeAll(() => {
    repository = new AcademicRecordMockRepository();
    academicRecordGetter = getAnAcademicRecordGetterMock();

    getByAdminUserSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new EditAcademicRecordHandler(repository, academicRecordGetter);
  });

  it('should update an academic record', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(academicRecord),
    );

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(academicRecord);
  });
});
