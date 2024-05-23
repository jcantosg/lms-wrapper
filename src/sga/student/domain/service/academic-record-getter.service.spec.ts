import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { getAnAcademicRecord, getAnAdminUser } from '#test/entity-factory';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

let service: AcademicRecordGetter;
let repository: AcademicRecordRepository;
let getByAdminUserSpy: jest.SpyInstance;
let getStudentAcademicRecordSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const adminUser = getAnAdminUser();

describe('Academic Record Getter Service', () => {
  beforeAll(() => {
    repository = new AcademicRecordMockRepository();
    service = new AcademicRecordGetter(repository);
    getByAdminUserSpy = jest.spyOn(repository, 'getByAdminUser');
    getStudentAcademicRecordSpy = jest.spyOn(
      repository,
      'getStudentAcademicRecords',
    );
  });

  it('should return an academic record', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicRecord | null> => Promise.resolve(academicRecord),
    );
    const result = await service.getByAdminUser(academicRecord.id, adminUser);
    expect(result).toEqual(academicRecord);
  });

  it('should throw an AcademicRecordNotFoundException', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicRecord | null> => Promise.resolve(null),
    );

    await expect(
      service.getByAdminUser(academicRecord.id, adminUser),
    ).rejects.toThrow(AcademicRecordNotFoundException);
  });

  it('should return a student academic records array', async () => {
    getStudentAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord[]> => Promise.resolve([academicRecord]),
    );
    const result = await service.getStudentAcademicRecord(
      academicRecord.id,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    expect(result).toEqual([academicRecord]);
  });

  it('should throw an AcademicRecordNotFoundException when array is empty', async () => {
    getStudentAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord[]> => Promise.resolve([]),
    );

    await expect(
      service.getStudentAcademicRecord(
        academicRecord.id,
        adminUser.businessUnits.map((bu) => bu.id),
        adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
    ).rejects.toThrow(AcademicRecordNotFoundException);
  });
});
