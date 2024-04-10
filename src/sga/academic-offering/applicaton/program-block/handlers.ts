import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';

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

export const programBlockHandlers = [createProgramBlockHandler];
