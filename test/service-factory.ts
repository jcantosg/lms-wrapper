import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';

export function getCountryGetterMock(): CountryGetter {
  return (CountryGetter as jest.Mocked<typeof CountryGetter>).prototype;
}

export function getAdminUserGetterMock(): AdminUserGetter {
  return (AdminUserGetter as jest.Mocked<typeof AdminUserGetter>).prototype;
}

export class PasswordEncoderMock implements PasswordEncoder {
  encodePassword = jest.fn();
}

export class PasswordCheckerMock implements PasswordChecker {
  checkPassword = jest.fn();
}

export function getBusinessUnitGetterMock(): BusinessUnitGetter {
  return (BusinessUnitGetter as jest.Mocked<typeof BusinessUnitGetter>)
    .prototype;
}

export function getVirtualCampusGetterMock(): VirtualCampusGetter {
  return (VirtualCampusGetter as jest.Mocked<typeof VirtualCampusGetter>)
    .prototype;
}

export function getAnExaminationCenterGetterMock(): ExaminationCenterGetter {
  return (
    ExaminationCenterGetter as jest.Mocked<typeof ExaminationCenterGetter>
  ).prototype;
}

export function getAClassroomGetterMock(): ClassroomGetter {
  return (ClassroomGetter as jest.Mocked<typeof ClassroomGetter>).prototype;
}
