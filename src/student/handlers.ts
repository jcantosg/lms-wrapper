import { GetAccessQualificationsHandler } from '#/student/application/get-access-qualifications/get-access-qualifications.handler';
import { CreateStudentHandler } from '#/student/application/create-student/create-student.handler';
import { StudentRepository } from '#/student/domain/repository/student.repository';
import { EditStudentHandler } from '#/student/application/edit-student/edit-student.handler';
import { StudentGetter } from '#/student/domain/service/student-getter.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { GetStudentsHandler } from '#/student/application/get-students/get-students.handler';
import { SearchStudentsHandler } from '#/student/application/search-students/search-students.handler';
import { academicRecordHandlers } from '#/student/application/academic-record/handlers';

const getAccessQualificationsHandler = {
  provide: GetAccessQualificationsHandler,
  useFactory: (): GetAccessQualificationsHandler =>
    new GetAccessQualificationsHandler(),
};

const createStudentHandler = {
  provide: CreateStudentHandler,
  useFactory: (repository: StudentRepository): CreateStudentHandler =>
    new CreateStudentHandler(repository),
  inject: [StudentRepository],
};

const editStudentHandler = {
  provide: EditStudentHandler,
  useFactory: (
    repository: StudentRepository,
    studentGetter: StudentGetter,
    countryGetter: CountryGetter,
    imageUploader: ImageUploader,
  ): EditStudentHandler =>
    new EditStudentHandler(
      repository,
      studentGetter,
      countryGetter,
      imageUploader,
    ),
  inject: [StudentRepository, StudentGetter, CountryGetter, ImageUploader],
};

const getStudentsHandler = {
  provide: GetStudentsHandler,
  useFactory: (repository: StudentRepository): GetStudentsHandler =>
    new GetStudentsHandler(repository),
  inject: [StudentRepository],
};

const searchStudentHandler = {
  provide: SearchStudentsHandler,
  useFactory: (repository: StudentRepository): SearchStudentsHandler =>
    new SearchStudentsHandler(repository),
  inject: [StudentRepository],
};

export const handlers = [
  getAccessQualificationsHandler,
  createStudentHandler,
  editStudentHandler,
  getStudentsHandler,
  searchStudentHandler,
  ...academicRecordHandlers,
];
