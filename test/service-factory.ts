import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { AdminUserPasswordGenerator } from '#admin-user/domain/service/admin-user-password-generator.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { AdminUserBusinessUnitsChecker } from '#admin-user/domain/service/admin-user-business-units.checker.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';

export function getCountryGetterMock(): CountryGetter {
  return (CountryGetter as jest.Mocked<typeof CountryGetter>).prototype;
}

export function getAdminUserGetterMock(): AdminUserGetter {
  return (AdminUserGetter as jest.Mocked<typeof AdminUserGetter>).prototype;
}

export function getEdaeUserGetterMock(): EdaeUserGetter {
  return (EdaeUserGetter as jest.Mocked<typeof EdaeUserGetter>).prototype;
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

export function getImageUploaderMock(): ImageUploader {
  return (ImageUploader as jest.Mocked<typeof ImageUploader>).prototype;
}

export function getPasswordGeneratorMock(): AdminUserPasswordGenerator {
  return (
    AdminUserPasswordGenerator as jest.Mocked<typeof AdminUserPasswordGenerator>
  ).prototype;
}

export function getAnAdminUserRolesCheckerMock(): AdminUserRolesChecker {
  return (AdminUserRolesChecker as jest.Mocked<typeof AdminUserRolesChecker>)
    .prototype;
}

export function getAnAdminUserBusinessUnitsCheckerMock(): AdminUserBusinessUnitsChecker {
  return (
    AdminUserBusinessUnitsChecker as jest.Mocked<
      typeof AdminUserBusinessUnitsChecker
    >
  ).prototype;
}
