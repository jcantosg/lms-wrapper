import { GetAllAcademicRecordModalitiesHandler } from '#student/application/academic-record/get-all-academic-record-modalities/get-all-academic-record-modalities.handler';
import { CreateAcademicRecordHandler } from '#student/application/academic-record/create-academic-record/create-academic-record.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { StudentGetter } from '#student/domain/service/student-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';

const createAcademicRecordHandler = {
  provide: CreateAcademicRecordHandler,
  useFactory: (
    repository: AcademicRecordRepository,
    businessUnitGetter: BusinessUnitGetter,
    virtualCampusGetter: VirtualCampusGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    studentGetter: StudentGetter,
  ): CreateAcademicRecordHandler =>
    new CreateAcademicRecordHandler(
      repository,
      businessUnitGetter,
      virtualCampusGetter,
      academicPeriodGetter,
      academicProgramGetter,
      studentGetter,
    ),
  inject: [
    AcademicRecordRepository,
    BusinessUnitGetter,
    VirtualCampusGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    StudentGetter,
  ],
};

export const academicRecordHandlers = [
  GetAllAcademicRecordModalitiesHandler,
  createAcademicRecordHandler,
];
