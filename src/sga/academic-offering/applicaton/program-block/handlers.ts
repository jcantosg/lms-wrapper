import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { EditProgramBlockHandler } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.handler';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { AddSubjectToProgramBlockHandler } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { DeleteProgramBlockHandler } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.handler';
import { GetSubjectsByProgramBlockHandler } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.handler';

const createProgramBlockHandler = {
  provide: CreateProgramBlockHandler,
  useFactory: (
    programBlockRepository: ProgramBlockRepository,
    academicProgramGetter: AcademicProgramGetter,
  ) => {
    return new CreateProgramBlockHandler(
      programBlockRepository,
      academicProgramGetter,
    );
  },
  inject: [ProgramBlockRepository, AcademicProgramGetter],
};
const editProgramBlockHandler = {
  provide: EditProgramBlockHandler,
  useFactory: (
    programBlockRepository: ProgramBlockRepository,
    programBlockGetter: ProgramBlockGetter,
  ) => new EditProgramBlockHandler(programBlockRepository, programBlockGetter),
  inject: [ProgramBlockRepository, ProgramBlockGetter],
};

const deleteProgramBlockHandler = {
  provide: DeleteProgramBlockHandler,
  useFactory: (
    programBlockRepository: ProgramBlockRepository,
    programBlockGetter: ProgramBlockGetter,
    academicProgramGetter: AcademicProgramGetter,
  ) =>
    new DeleteProgramBlockHandler(
      programBlockRepository,
      programBlockGetter,
      academicProgramGetter,
    ),
  inject: [ProgramBlockRepository, ProgramBlockGetter, AcademicProgramGetter],
};

const getSubjectsByProgramBlockHandler = {
  provide: GetSubjectsByProgramBlockHandler,
  useFactory: (programBlockGetter: ProgramBlockGetter) =>
    new GetSubjectsByProgramBlockHandler(programBlockGetter),
  inject: [ProgramBlockGetter],
};

const addSubjectToProgramBlockHandler = {
  provide: AddSubjectToProgramBlockHandler,
  useFactory: (
    repository: ProgramBlockRepository,
    programBlockGetter: ProgramBlockGetter,
    subjectGetter: SubjectGetter,
  ) =>
    new AddSubjectToProgramBlockHandler(
      repository,
      programBlockGetter,
      subjectGetter,
    ),
  inject: [ProgramBlockRepository, ProgramBlockGetter, SubjectGetter],
};

export const programBlockHandlers = [
  createProgramBlockHandler,
  editProgramBlockHandler,
  addSubjectToProgramBlockHandler,
  deleteProgramBlockHandler,
  getSubjectsByProgramBlockHandler,
];
