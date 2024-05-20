import { GetAllAcademicRecordModalitiesController } from '#student/infrastructure/controller/academic-record/get-all-academic-record-modalities.controller';
import { CreateAcademicRecordController } from '#student/infrastructure/controller/academic-record/create-academic-record.controller';
import { EditAcademicRecordController } from '#student/infrastructure/controller/academic-record/edit-academic-record.controller';
import { AcademicRecordDetailController } from '#student/infrastructure/controller/academic-record/get-academic-record-detail.controller';
import { GetStudentAcademicRecordController } from '#student/infrastructure/controller/academic-record/get-student-academic-record.controller';

export const academicRecordControllers = [
  GetAllAcademicRecordModalitiesController,
  CreateAcademicRecordController,
  EditAcademicRecordController,
  AcademicRecordDetailController,
  GetStudentAcademicRecordController,
];
