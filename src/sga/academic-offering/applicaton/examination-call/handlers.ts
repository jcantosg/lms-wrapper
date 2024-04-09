import { CreateExaminationCallHandler } from '#academic-offering/applicaton/examination-call/create-examination-call/create-examination-call.handler';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { EditExaminationCallHandler } from '#academic-offering/applicaton/examination-call/edit-examination-call/edit-examination-call.handler';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call/examination-call-getter.service';
import { DeleteExaminationCallHandler } from '#academic-offering/applicaton/examination-call/delete-examination-call/delete-examination-call.handler';

const createExaminationCallHandler = {
  provide: CreateExaminationCallHandler,
  useFactory: (
    repository: ExaminationCallRepository,
    academicPeriodGetter: AcademicPeriodGetter,
  ) => {
    return new CreateExaminationCallHandler(repository, academicPeriodGetter);
  },
  inject: [ExaminationCallRepository, AcademicPeriodGetter],
};

const editExaminationCallHandler = {
  provide: EditExaminationCallHandler,
  useFactory: (
    repository: ExaminationCallRepository,
    getter: ExaminationCallGetter,
  ) => {
    return new EditExaminationCallHandler(repository, getter);
  },
  inject: [ExaminationCallRepository, ExaminationCallGetter],
};
const deleteExaminationCallHandler = {
  provide: DeleteExaminationCallHandler,
  useFactory: (
    repository: ExaminationCallRepository,
    getter: ExaminationCallGetter,
  ): DeleteExaminationCallHandler =>
    new DeleteExaminationCallHandler(repository, getter),
  inject: [ExaminationCallRepository, ExaminationCallGetter],
};

export const examinationCallHandlers = [
  createExaminationCallHandler,
  editExaminationCallHandler,
  deleteExaminationCallHandler,
];
