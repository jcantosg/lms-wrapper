import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { getAnIdentityDocument } from '#test/value-object-factory';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { File } from '#shared/domain/file-manager/file';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { StudentRecoveryPasswordToken } from '#/student/student/domain/entity/student-recovery-password-token.entity';

export const getACountry = (id = uuid()): Country => {
  return Country.create(id, 'ES', 'ESP', 'España', '+34', '🇪🇸');
};

export const getAnEdaeUser = (id: string = uuid()): EdaeUser => {
  return EdaeUser.create(
    id,
    'test',
    'surname',
    'surname2',
    'test@universae.com',
    getAnIdentityDocument(),
    [EdaeRoles.COORDINADOR_FCT],
    [],
    TimeZoneEnum.GMT_PLUS_1,
    true,
    getACountry(),
    'avatar',
  );
};

export const getAnAdminUser = (id = uuid()): AdminUser => {
  return AdminUser.create(
    id,
    'test@email.com',
    'password',
    [AdminUserRoles.SUPERADMIN],
    'name',
    'avatar',
    [],
    'surname',
    'surname2',
    new IdentityDocument({
      identityDocumentType: IdentityDocumentType.DNI,
      identityDocumentNumber: '74700994F',
    }),
  );
};

export const getABusinessUnit = (id = uuid()): BusinessUnit => {
  return BusinessUnit.create(
    id,
    'name',
    'code',
    getACountry(),
    getAnAdminUser(),
  );
};

export const getAVirtualCampus = (id = uuid()): VirtualCampus => {
  return VirtualCampus.create(
    id,
    'name',
    'code',
    getABusinessUnit(),
    getAnAdminUser(),
  );
};

export const getAnExaminationCenter = (
  id: string = uuid(),
): ExaminationCenter => {
  return ExaminationCenter.create(
    id,
    'name',
    'code',
    [],
    'address',
    getAnAdminUser(),
    getACountry(),
  );
};
export const getAMainExaminationCenter = (
  id: string = uuid(),
): ExaminationCenter => {
  return ExaminationCenter.createFromBusinessUnit(
    id,
    getABusinessUnit(),
    getAnAdminUser(),
    'code',
  );
};

export const getAClassroom = (id: string = uuid()): Classroom => {
  return Classroom.create(
    id,
    'code',
    'name',
    4,
    getAnAdminUser(),
    getAnExaminationCenter(),
  );
};

export const getAnEvaluationType = (id: string = uuid()): EvaluationType => {
  return EvaluationType.create(id, 'test', 60, 40, 0, false, [
    getABusinessUnit(),
  ]);
};

export const getAnAcademicPeriod = (id: string = uuid()): AcademicPeriod => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 10);

  return AcademicPeriod.create(
    id,
    'name',
    'code',
    startDate,
    endDate,
    getABusinessUnit(),
    1,
    getAnAdminUser(),
  );
};

export const getASubject = (id: string = uuid()): Subject => {
  return Subject.create(
    id,
    'url',
    'name',
    'code',
    'code',
    10,
    SubjectModality.ELEARNING,
    getAnEvaluationType(),
    SubjectType.SUBJECT,
    getABusinessUnit(),
    true,
    true,
    getAnAdminUser(),
    'MUR',
  );
};

export const getAnAcademicProgram = (id: string = uuid()): AcademicProgram => {
  return AcademicProgram.create(
    id,
    'name',
    'code',
    getATitle(),
    getABusinessUnit(),
    getAnAdminUser(),
    ProgramBlockStructureType.CUSTOM,
  );
};

export const getAFile = (): File => {
  return new File('test', 'test', Buffer.from('test'));
};

export const getASubjectResource = (id: string = uuid()): SubjectResource => {
  return SubjectResource.create(
    id,
    'name',
    'url',
    10,
    getASubject(),
    getAnAdminUser(),
  );
};

export const getATitle = (id: string = uuid()): Title => {
  return Title.create(
    id,
    'name',
    'officialCode',
    'officialTitle',
    'officialProgram',
    getABusinessUnit(),
    getAnAdminUser(),
  );
};

export const getAProgramBlock = (
  id: string = uuid(),
  academicProgram: AcademicProgram = getAnAcademicProgram(),
): ProgramBlock => {
  return ProgramBlock.create(id, 'name', academicProgram, getAnAdminUser());
};

export const getARecoveryPasswordToken = (): RecoveryPasswordToken => {
  return RecoveryPasswordToken.createForUser(
    uuid(),
    getAnAdminUser(),
    'token',
    999,
  );
};

export const getAPeriodBlock = (
  startDate: Date = new Date(),
  enddate: Date = new Date(),
  id: string = uuid(),
  academicPeriod: AcademicPeriod = getAnAcademicPeriod(),
): PeriodBlock => {
  return PeriodBlock.create(
    id,
    academicPeriod,
    'name',
    startDate,
    enddate,
    getAnAdminUser(),
  );
};

export const getASGAStudent = (): Student => {
  return Student.createFromSGA(
    uuid(),
    'test',
    'test',
    'test',
    'test@test.org',
    'test@universae.com',
    getAnAdminUser(),
    'test',
  );
};

export const getAnAcademicRecord = (): AcademicRecord => {
  return AcademicRecord.create(
    uuid(),
    getABusinessUnit(),
    getAVirtualCampus(),
    getASGAStudent(),
    getAnAcademicPeriod(),
    getAnAcademicProgram(),
    AcademicRecordModalityEnum.PRESENCIAL,
    false,
    getAnAdminUser(),
  );
};

export const getABlockRelation = (
  periodBlock: PeriodBlock,
  programBlock: ProgramBlock,
): BlockRelation => {
  return BlockRelation.create(
    uuid(),
    periodBlock,
    programBlock,
    getAnAdminUser(),
  );
};

export const getAnInternalGroup = (
  academicPeriod: AcademicPeriod,
  academicProgram: AcademicProgram,
  periodBlock: PeriodBlock,
  subject: Subject,
): InternalGroup => {
  return InternalGroup.create(
    uuid(),
    'code',
    [],
    [],
    academicPeriod,
    academicProgram,
    periodBlock,
    subject,
    getABusinessUnit(),
    true,
    getAnAdminUser(),
  );
};

export const getAnEnrollment = (): Enrollment => {
  return Enrollment.create(
    uuid(),
    getASubject(),
    getAnAcademicRecord(),
    EnrollmentVisibilityEnum.PD,
    EnrollmentTypeEnum.UNIVERSAE,
    getAProgramBlock(),
    getAnAdminUser(),
  );
};

export const getAnAdministrativeGroup = (): AdministrativeGroup => {
  return AdministrativeGroup.create(
    uuid(),
    'code',
    getABusinessUnit(),
    getAnAcademicPeriod(),
    getAnAcademicProgram(),
    getAProgramBlock(),
    getAPeriodBlock(),
    getAnAdminUser(),
  );
};

export const getANotTakenSubjectCall = () =>
  SubjectCall.create(
    uuid(),
    getAnEnrollment(),
    1,
    new Date(),
    SubjectCallFinalGradeEnum.NP,
    SubjectCallStatusEnum.NOT_STARTED,
    getAnAdminUser(),
  );

export const getATakenSubjectCall = () =>
  SubjectCall.create(
    uuid(),
    getAnEnrollment(),
    2,
    new Date(),
    SubjectCallFinalGradeEnum.EIGHT,
    SubjectCallStatusEnum.PASSED,
    getAnAdminUser(),
  );
export const getAStudentRecoveryPasswordToken =
  (): StudentRecoveryPasswordToken => {
    return StudentRecoveryPasswordToken.create(
      uuid(),
      999,
      'token',
      getASGAStudent(),
    );
  };
