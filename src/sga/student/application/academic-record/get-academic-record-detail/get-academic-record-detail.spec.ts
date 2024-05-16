import { GetAcademicRecordDetailHandler } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetAcademicRecordDetailQuery } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.query';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { getAnAcademicRecord } from '#test/entity-factory';
import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';

let handler: GetAcademicRecordDetailHandler;
let academicRecordGetter: AcademicRecordGetter;
let getAcademicRecordSpy: jest.SpyInstance;

const mockCountry = Country.create(
  'countryId',
  'ISO',
  'CISO',
  'countryName',
  '+123',
  '🌍',
);

const mockAdminUser = AdminUser.create(
  'adminUserId',
  'laracroft@example.com',
  'password123',
  [AdminUserRoles.SUPERADMIN],
  'Lara',
  'avatarUrl',
  [],
  'Croft',
  null,
  new IdentityDocument({
    identityDocumentType: IdentityDocumentType.DNI,
    identityDocumentNumber: '29208576W',
  }),
);

const mockBusinessUnit = BusinessUnit.create(
  'bu1',
  'Business Unit 1',
  'BU1',
  mockCountry,
  mockAdminUser,
);

mockAdminUser.businessUnits.push(mockBusinessUnit);

describe('GetAcademicRecordDetailHandler', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    handler = new GetAcademicRecordDetailHandler(academicRecordGetter);
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
  });

  it('should return an academic record', async () => {
    const academicRecord = getAnAcademicRecord();
    getAcademicRecordSpy.mockResolvedValue(academicRecord);
    const query = new GetAcademicRecordDetailQuery(
      'academicRecordId',
      mockAdminUser,
    );

    const result = await handler.handle(query);

    expect(getAcademicRecordSpy).toHaveBeenCalledWith(
      'academicRecordId',
      mockAdminUser,
    );
    expect(result).toEqual(academicRecord);
  });

  it('should throw an AcademicRecordNotFoundException', async () => {
    const query = new GetAcademicRecordDetailQuery('invalid-id', mockAdminUser);
    getAcademicRecordSpy.mockRejectedValue(
      new AcademicRecordNotFoundException(),
    );

    await expect(handler.handle(query)).rejects.toThrow(
      AcademicRecordNotFoundException,
    );
  });
});
