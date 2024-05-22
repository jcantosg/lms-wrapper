import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { EditProgramBlockHandler } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.handler';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { AddSubjectToProgramBlockHandler } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { DeleteProgramBlockHandler } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.handler';
import { GetSubjectsByProgramBlockHandler } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.handler';
import { RemoveSubjectFromProgramBlockHandler } from '#academic-offering/applicaton/program-block/remove-subject-from-program-block/remove-subject-from-program-block.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';

const createProgramBlockHandler = {
  provide: CreateProgramBlockHandler,
  useFactory: (
    programBlockRepository: ProgramBlockRepository,
    academicProgramGetter: AcademicProgramGetter,
    academicProgramRepository: AcademicProgramRepository,
  ) => {
    return new CreateProgramBlockHandler(
      programBlockRepository,
      academicProgramGetter,
      academicProgramRepository,
    );
  },
  inject: [
    ProgramBlockRepository,
    AcademicProgramGetter,
    AcademicProgramRepository,
  ],
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
    academicProgramRepository: AcademicProgramRepository,
  ) =>
    new DeleteProgramBlockHandler(
      programBlockRepository,
      programBlockGetter,
      academicProgramGetter,
      academicProgramRepository,
    ),
  inject: [
    ProgramBlockRepository,
    ProgramBlockGetter,
    AcademicProgramGetter,
    AcademicProgramRepository,
  ],
};

const getSubjectsByProgramBlockHandler = {
  provide: GetSubjectsByProgramBlockHandler,
  useFactory: (programBlockGetter: ProgramBlockGetter) =>
    new GetSubjectsByProgramBlockHandler(programBlockGetter),
  inject: [ProgramBlockGetter],
};

const removeSubjectFromProgramBlockHandler = {
  provide: RemoveSubjectFromProgramBlockHandler,
  useFactory: (
    repository: ProgramBlockRepository,
    subjectGetter: SubjectGetter,
    programBlockGetter: ProgramBlockGetter,
  ): RemoveSubjectFromProgramBlockHandler =>
    new RemoveSubjectFromProgramBlockHandler(
      repository,
      subjectGetter,
      programBlockGetter,
    ),
  inject: [ProgramBlockRepository, SubjectGetter, ProgramBlockGetter],
};

const addSubjectToProgramBlockHandler = {
  provide: AddSubjectToProgramBlockHandler,
  useFactory: (
    repository: ProgramBlockRepository,
    subjectRepository: SubjectRepository,
    programBlockGetter: ProgramBlockGetter,
    subjectGetter: SubjectGetter,
  ) =>
    new AddSubjectToProgramBlockHandler(
      repository,
      subjectRepository,
      programBlockGetter,
      subjectGetter,
    ),
  inject: [
    ProgramBlockRepository,
    SubjectRepository,
    ProgramBlockGetter,
    SubjectGetter,
  ],
};

export const programBlockHandlers = [
  createProgramBlockHandler,
  editProgramBlockHandler,
  addSubjectToProgramBlockHandler,
  deleteProgramBlockHandler,
  getSubjectsByProgramBlockHandler,
  removeSubjectFromProgramBlockHandler,
];
