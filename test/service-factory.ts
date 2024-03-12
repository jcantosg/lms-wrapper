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
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';

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

export function getEdaeUserBusinessUnitCheckerMock(): EdaeUserBusinessUnitChecker {
  return (
    EdaeUserBusinessUnitChecker as jest.Mocked<
      typeof EdaeUserBusinessUnitChecker
    >
  ).prototype;
}

export function getAnEvaluationTypeGetterMock(): EvaluationTypeGetter {
  return (EvaluationTypeGetter as jest.Mocked<typeof EvaluationTypeGetter>)
    .prototype;
}

export function getASubjectGetterMock(): SubjectGetter {
  return (SubjectGetter as jest.Mocked<typeof SubjectGetter>).prototype;
}

export function getAnEvaluationTypeBusinessUnitCheckerMock(): EvaluationTypeBusinessUnitChecker {
  return (
    EvaluationTypeBusinessUnitChecker as jest.Mocked<
      typeof EvaluationTypeBusinessUnitChecker
    >
  ).prototype;
}

export function getASubjectBusinessUnitCheckerMock(): SubjectBusinessUnitChecker {
  return (
    SubjectBusinessUnitChecker as jest.Mocked<typeof SubjectBusinessUnitChecker>
  ).prototype;
}
