import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Logger } from '@nestjs/common';
import {
  academicPrograms as academicProgramsRaw,
  subjects as subjectsRaw,
} from '#commands/academic-program/academic-programs';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export async function seedAcademicPrograms(logger: Logger) {
  const titleRepository = datasource.getRepository(Title);
  const academicProgramRepository = datasource.getRepository(AcademicProgram);
  const programBlockRepository = datasource.getRepository(ProgramBlock);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);
  const subjectRepository = datasource.getRepository(Subject);
  const evaluationTypeRepository = datasource.getRepository(EvaluationType);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  const businessUnit = await businessUnitRepository.findOne({
    where: { id: '68fc5295-d99d-432d-a989-433361974791' },
  });

  const title = await titleRepository.findOne({
    where: { id: '68fc5295-d99d-432d-a989-433361974792' },
  });

  const evaluationType = await evaluationTypeRepository.findOne({
    where: { id: '8adeb962-3669-4c37-ada0-01328ef74c00' },
  });

  const academicPrograms: AcademicProgram[] = [];
  const programBlocks: ProgramBlock[] = [];
  const subjects: Subject[] = [];

  academicProgramsRaw.forEach((academicProgramRaw) => {
    const academicProgram = AcademicProgram.create(
      academicProgramRaw.id,
      academicProgramRaw.name,
      academicProgramRaw.code,
      title!,
      businessUnit!,
      adminSga!,
      ProgramBlockStructureType.SEMESTER,
    );
    programBlocks.push(
      ProgramBlock.create(
        academicProgramRaw.programBlocks[0],
        'Bloque 1',
        academicProgram,
        adminSga!,
      ),
    );
    programBlocks.push(
      ProgramBlock.create(
        academicProgramRaw.programBlocks[1],
        'Bloque 2',
        academicProgram,
        adminSga!,
      ),
    );
    academicProgram.addProgramBlock(programBlocks[0]);
    academicProgram.addProgramBlock(programBlocks[1]);
    academicPrograms.push(academicProgram);
  });

  subjectsRaw.forEach((subjectRaw) => {
    const subject = Subject.create(
      subjectRaw.id,
      null,
      subjectRaw.name,
      subjectRaw.code,
      subjectRaw.officialCode,
      subjectRaw.hours,
      SubjectModality.ELEARNING,
      evaluationType!,
      SubjectType.SUBJECT,
      businessUnit!,
      subjectRaw.isRegulated,
      subjectRaw.isCore,
      adminSga!,
      null,
    );
    subject.programBlocks = programBlocks;
    subjects.push(subject);
  });

  await academicProgramRepository.save(academicPrograms);
  await programBlockRepository.save(programBlocks);
  await subjectRepository.save(subjects);
  logger.log('Academic Programs created');
}
