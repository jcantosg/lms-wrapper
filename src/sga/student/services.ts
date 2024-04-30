import { StudentGetter } from '#student/domain/service/student-getter.service';
import { StudentRepository } from '#student/domain/repository/student.repository';

const studentGetter = {
  provide: StudentGetter,
  useFactory: (repository: StudentRepository): StudentGetter =>
    new StudentGetter(repository),
  inject: [StudentRepository],
};

export const services = [studentGetter];
