import { GetStudentAcademicRecordsHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetStudentAcademicRecordHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';

const getStudentAcademicRecordsHandler = {
  provide: GetStudentAcademicRecordsHandler,
  useFactory: (
    repository: AcademicRecordRepository,
  ): GetStudentAcademicRecordsHandler =>
    new GetStudentAcademicRecordsHandler(repository),
  inject: [AcademicRecordRepository],
};

const getAcademicRecordHandler = {
  provide: GetStudentAcademicRecordHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
  ): GetStudentAcademicRecordHandler =>
    new GetStudentAcademicRecordHandler(academicRecordGetter),
  inject: [AcademicRecordGetter],
};

export const studentAcademicRecordHandlers = [
  getStudentAcademicRecordsHandler,
  getAcademicRecordHandler,
];
