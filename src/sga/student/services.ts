import { StudentGetter } from '#student/domain/service/student-getter.service';
import { StudentRepository } from '#student/domain/repository/student.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';

const studentGetter = {
  provide: StudentGetter,
  useFactory: (repository: StudentRepository): StudentGetter =>
    new StudentGetter(repository),
  inject: [StudentRepository],
};

const academicRecordGetter = {
  provide: AcademicRecordGetter,
  useFactory: (repository: AcademicRecordRepository): AcademicRecordGetter =>
    new AcademicRecordGetter(repository),
  inject: [AcademicRecordRepository],
};

const enrollmentGetter = {
  provide: EnrollmentGetter,
  useFactory: (repository: EnrollmentRepository): EnrollmentGetter =>
    new EnrollmentGetter(repository),
  inject: [EnrollmentRepository],
};

const administrativeGroupGetter = {
  provide: AdministrativeGroupGetter,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): AdministrativeGroupGetter => new AdministrativeGroupGetter(repository),
  inject: [AdministrativeGroupRepository],
};

export const services = [
  studentGetter,
  academicRecordGetter,
  enrollmentGetter,
  administrativeGroupGetter,
];
