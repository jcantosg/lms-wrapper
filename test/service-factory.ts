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
import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/examination-type/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject/subject-business-unit-checker.service';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call/examination-call-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject/subject-resource-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { JwtTokenGenerator } from '#admin-user/infrastructure/service/jwt-token-generator.service';
import { RecoveryPasswordTokenGetter } from '#admin-user/domain/service/recovery-password-token-getter.service';
import { JwtService } from '@nestjs/jwt';
import { StudentGetter } from '#/student/domain/service/student-getter.service';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';

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

export function getAnAcademicPeriodGetterMock(): AcademicPeriodGetter {
  return (AcademicPeriodGetter as jest.Mocked<typeof AcademicPeriodGetter>)
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

export function getAnExaminationCallGetterMock(): ExaminationCallGetter {
  return (ExaminationCallGetter as jest.Mocked<typeof ExaminationCallGetter>)
    .prototype;
}

export function getAFileManagerMock(): FileManager {
  return (FileManager as jest.Mocked<typeof FileManager>).prototype;
}

export function getASubjectResourceGetterMock(): SubjectResourceGetter {
  return (SubjectResourceGetter as jest.Mocked<typeof SubjectResourceGetter>)
    .prototype;
}

export function getATitleGetterMock(): TitleGetter {
  return (TitleGetter as jest.Mocked<typeof TitleGetter>).prototype;
}

export function getAnAcademicProgramGetterMock(): AcademicProgramGetter {
  return (AcademicProgramGetter as jest.Mocked<typeof AcademicProgramGetter>)
    .prototype;
}

export function getAProgramBlockGetterMock(): ProgramBlockGetter {
  return (ProgramBlockGetter as jest.Mocked<typeof ProgramBlockGetter>)
    .prototype;
}

export function getAJwtTokenGeneratorMock(): JwtTokenGenerator {
  return (JwtTokenGenerator as jest.Mocked<typeof JwtTokenGenerator>).prototype;
}

export function getRecoveryPasswordTokenGetterMock(): RecoveryPasswordTokenGetter {
  return (
    RecoveryPasswordTokenGetter as jest.Mocked<
      typeof RecoveryPasswordTokenGetter
    >
  ).prototype;
}

export function getAJwtServiceMock(): JwtService {
  return (JwtService as jest.Mocked<typeof JwtService>).prototype;
}

export function getAStudentGetterMock(): StudentGetter {
  return (StudentGetter as jest.Mocked<typeof StudentGetter>).prototype;
}

export class PasswordFormatCheckerMock implements PasswordFormatChecker {
  check = jest.fn();
}
