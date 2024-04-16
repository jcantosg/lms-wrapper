import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { EditProgramBlockHandler } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.handler';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
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

const getSubjectsByProgramBlockHandler = {
  provide: GetSubjectsByProgramBlockHandler,
  useFactory: (programBlockGetter: ProgramBlockGetter) =>
    new GetSubjectsByProgramBlockHandler(programBlockGetter),
  inject: [ProgramBlockGetter],
};

export const programBlockHandlers = [
  createProgramBlockHandler,
  editProgramBlockHandler,
  getSubjectsByProgramBlockHandler,
];
