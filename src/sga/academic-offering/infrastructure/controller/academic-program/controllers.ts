import { GetAcademicProgramController } from '#academic-offering/infrastructure/controller/academic-program/get-academic-program/get-academic-program.controller';
import { GetAcademicProgramsByTitleController } from '#academic-offering/infrastructure/controller/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.controller';
import { GetAllAcademicProgramsController } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-programs/get-all-academic-programs.controller';
import { GetAllAcademicProgramsPlainController } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-programs-plain/get-all-academic-programs-plain.controller';
import { SearchAcademicProgramsController } from '#academic-offering/infrastructure/controller/academic-program/search-academic-programs/search-academic-programs.controller';
import { SearchAcademicProgramsByTitleController } from '#academic-offering/infrastructure/controller/academic-program/search-academic-programs-by-title/search-academic-programs-by-title.controller';
import { AddAcademicProgramToAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-program/add-academic-program-to-academic-period.controller';
import { CreateAcademicProgramController } from '#academic-offering/infrastructure/controller/academic-program/create-academic-program.controller';
import { EditAcademicProgramController } from '#academic-offering/infrastructure/controller/academic-program/edit-academic-program.controller';
import { RemoveAcademicProgramFromAcademicPeriodController } from '#academic-offering/infrastructure/controller/academic-program/remove-academic-program-from-academic-period.controller';
import { GetAllProgramBlockStructureTypesController } from '#academic-offering/infrastructure/controller/academic-program/get-all-program-block-structure-types.controller';

export const academicProgramControllers = [
  GetAcademicProgramsByTitleController,
  GetAllAcademicProgramsController,
  GetAllAcademicProgramsPlainController,
  SearchAcademicProgramsController,
  SearchAcademicProgramsByTitleController,
  GetAcademicProgramController,
  AddAcademicProgramToAcademicPeriodController,
  CreateAcademicProgramController,
  EditAcademicProgramController,
  RemoveAcademicProgramFromAcademicPeriodController,
  GetAllProgramBlockStructureTypesController,
];